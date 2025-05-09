import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ALLORA_API_KEY, ALLORA_API_URL, HOST } from '../app.settings'
import axios from 'axios'
import { IProvider } from './provider.types'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { ProviderDto } from './dto/provider.dto'
import { SubmissionDto } from './dto/submission.dto'
import { Prisma } from '@prisma/client'
import { decryptApiKey, encryptApiKey, generateUniqueId } from 'src/app.utils'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCallback)

@Injectable()
export class ProviderService {
  constructor(private prisma: PrismaService) {}

  async getAllProviders() {
    try {
      const providers = await this.prisma.dataProvider.findMany({
        where: {
          active: true
        },
        select: {
          id: true,
          name: true,
          endpoint: true,
          type: true,
          active: true,
          description: true,
          inputVariables: true,
          outputVariables: true,
          iconUrl: true,
          createdAt: true,
          updatedAt: true,
          aiModel: true
        }
      })
      return providers
    } catch (error) {
      console.error('Error fetching providers:', error)
      throw error
    }
  }

  async getProviderById(id: number) {
    try {
      const provider = await this.prisma.dataProvider.findUnique({
        where: { id }
      })
      return {
        ...provider,
        apiKey: undefined
      }
    } catch (error) {
      console.error(`Error fetching provider with id ${id}:`, error)
      throw error
    }
  }

  async loadJsonConfig(fileUrl: string) {
    const response = await axios.get(fileUrl)
    const data = response.data
    // Transform plain object to class instance
    const providerDto = plainToInstance(ProviderDto, data)
    // Validate the instance
    const errors = await validate(providerDto)
    if (errors.length > 0) {
      throw new BadRequestException('Invalid provider configuration')
    }

    // check if the data is empty
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Provider configuration is empty')
    }

    // If validation passes, convert to IProvider
    const provider: IProvider = {
      id: data.id,
      name: data.name,
      description: data.description,
      icon_url: data.icon_url,
      methods: data.methods.map((method) => ({
        method_name: method.method_name,
        description: method.description,
        input_schema: method.input_schema,
        input_type: method.input_type,
        output_schema: method.output_schema,
        type: method.type,
        playground: method.playground
      }))
    }
    return provider
  }

  async submitProvider(submissionDto: SubmissionDto) {
    // check all fields are filled
    if (
      !submissionDto.configUrl ||
      !submissionDto.url ||
      !submissionDto.apiKey ||
      !submissionDto.prUrl
    ) {
      throw new BadRequestException('All fields are required')
    }
    const jsonConfig = await this.loadJsonConfig(submissionDto.configUrl)
    const code = generateUniqueId()
    const apiKeyEncrypted = encryptApiKey(JSON.stringify(submissionDto.apiKey))
    const providerData: Prisma.ProviderV2CreateInput = {
      name: jsonConfig.name,
      description: jsonConfig.description,
      iconUrl: jsonConfig.icon_url,
      status: 'inactive',
      code: `P${code}`,
      baseUrl: submissionDto.url,
      apiKey: apiKeyEncrypted,
      documentLink: submissionDto.documentLink,
      prUrl: submissionDto.prUrl
    }

    const provider = await this.prisma.providerV2.create({
      data: providerData
    })

    // create endpoint
    const endpoints: Prisma.ProviderMethodCreateManyInput[] = await Promise.all(
      jsonConfig.methods.map(async (method) => {
        if (!method.input_schema || !method.output_schema) {
          throw new BadRequestException('Input or output schema is missing')
        }
        const inputEntity = await this.prisma.entity.create({
          data: {
            name: method.method_name,
            object: method.input_schema as unknown as Prisma.InputJsonValue
          }
        })
        const outputEntity = await this.prisma.entity.create({
          data: {
            name: method.method_name,
            object: method.output_schema as unknown as Prisma.InputJsonValue
          }
        })
        return {
          providerId: provider.id,
          methodName: method.method_name,
          methodType: method.type,
          description: method.description,
          endpoint: `${submissionDto.url}/${method.method_name}`,
          inputType: method.input_type,
          playgroundUrl: method.playground,
          inputEntityId: inputEntity.id,
          outputEntityId: outputEntity.id
        }
      })
    )

    await this.prisma.providerMethod.createMany({
      data: endpoints
    })

    return {
      message: 'Provider submitted successfully',
      data: {
        providerId: provider.id,
        providerCode: provider.code
      }
    }
  }

  async playground(curl: string) {
    try {
      // Remove escaped characters and extra whitespace
      const cleanCurl = curl
        .replace(/\\\s*/g, '') // Remove backslashes and following whitespace
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()

      // Add silent flag if not present
      const silentCurl = cleanCurl.includes(' -s ')
        ? cleanCurl
        : cleanCurl.replace('curl', 'curl -s')

      const { stdout, stderr } = await exec(silentCurl)

      // Try to parse the output as JSON
      try {
        return JSON.parse(stdout)
      } catch {
        // If output is not JSON, return it as is
        return stdout
      }
    } catch (error) {
      throw new BadRequestException(`Failed to execute curl command: ${error.message}`)
    }
  }

  async testEncryptApiKey(apiKey: string) {
    const encryptedApiKey = encryptApiKey(apiKey)
    console.log(encryptedApiKey)
    return encryptedApiKey
  }

  async testDecryptApiKey(apiKey: string) {
    const decryptedApiKey = decryptApiKey(apiKey)
    console.log(decryptedApiKey)
    return decryptedApiKey
  }

  async alloraInference(coinName: string, predictionType: string) {
    try {
      const axiosInstance = axios.create({
        baseURL: ALLORA_API_URL,
        headers: {
          'x-api-key': `${ALLORA_API_KEY}`
        }
      })
      const response = await axiosInstance.get(
        `v2/allora/consumer/price/ethereum-11155111/${coinName}/${predictionType}`
      )
      return response.data.data
    } catch (error) {
      console.error('Error fetching Allora data:', error)
      throw new BadRequestException(`Failed to fetch Allora data: ${error.message}`)
    }
  }
}
