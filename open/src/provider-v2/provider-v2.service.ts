import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { providerStructure } from '../structures/provider'
import axios from 'axios'
import { decryptApiKey, encryptApiKey, generateUniqueId } from 'src/app.utils'
import { SubmissionDto } from 'src/providers/dto/submission.dto'
import { ProviderDto } from 'src/providers/dto/provider.dto'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Prisma } from '@prisma/client'
import { IProvider } from 'src/providers/provider.types'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCallback)

@Injectable()
export class ProviderV2Service {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProviders() {
    const data = await this.prisma.providerV2.findMany({
      where: {
        status: 'active'
      },
      include: {
        ProviderMethod: { include: { inputEntity: true, outputEntity: true } },
        category: true
      }
    })

    return data.map((provider) => {
      return {
        id: provider.code,
        name: provider.name,
        description: provider.description,
        iconUrl: provider.iconUrl,
        documentLink: provider.documentLink,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
        methods: provider.ProviderMethod.map((method) => {
          return {
            name: method.methodName,
            description: method.description,
            inputSchema: method.inputEntity,
            inputType: method.inputType,
            outputSchema: method.outputEntity,
            playground: method.playgroundUrl,
            type: method.methodType
          }
        }),
        category: provider.category?.name || '',
        categoryId: provider.category?.id || 0,
        requestCount: provider.requestCount
      }
    })
  }

  async getProviderById(id: string) {
    const data = await this.prisma.providerV2.findUnique({
      where: { code: id, status: 'active' },
      include: {
        ProviderMethod: { include: { inputEntity: true, outputEntity: true } },
        category: true
      }
    })
    if (!data) {
      throw new BadRequestException(`Provider ${id} not found`)
    }

    const entities = [
      ...data.ProviderMethod.map((method) => method.inputEntity.name),
      ...data.ProviderMethod.map((method) => method.outputEntity.name)
    ]

    return {
      id: data.code,
      name: data.name,
      description: data.description,
      iconUrl: data.iconUrl,
      documentLink: data.documentLink,
      website: data.website,
      github: data.github,
      tokenId: data.tokenId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      category: data.category?.name || '',
      categoryId: data.category?.id || 0,
      methods: data.ProviderMethod.map((method) => {
        return {
          name: method.methodName,
          description: method.description,
          inputSchema: method.inputEntity,
          inputType: method.inputType,
          outputSchema: method.outputEntity,
          playground: method.playgroundUrl,
          type: method.methodType
        }
      }),
      entities: entities.filter((entity, index, self) => self.indexOf(entity) === index),
      requestCount: data.requestCount
    }
  }

  async providerStructure() {
    return providerStructure
  }

  async executeMethod(providerId: string, methodName: string, input: { [key: string]: any }) {
    const provider = await this.prisma.providerV2.findUnique({
      where: { code: providerId },
      include: { ProviderMethod: { include: { inputEntity: true, outputEntity: true } } }
    })
    if (!provider) {
      throw new BadRequestException(`Provider ${providerId} not found`)
    }
    const method = provider.ProviderMethod.find((method) => method.methodName === methodName)
    if (!method) {
      throw new BadRequestException(`Method ${methodName} not found`)
    }
    const methodInput = method.inputEntity.object
    const methodInputKeys = Object.keys(methodInput)
    const inputValues = methodInputKeys.map((key) => input[key])
    if (inputValues.length !== methodInputKeys.length) {
      throw new BadRequestException(`Input values length mismatch`)
    }

    let endpointUrl = `${provider.baseUrl}`
    if (method.endpoint) {
      endpointUrl = `${endpointUrl}/${method.endpoint}`
    }
    const methodType = method.methodType
    const apiKey = JSON.parse(decryptApiKey(provider.apiKey))
    const headers = {
      'Content-Type': 'application/json',
      ...JSON.parse(apiKey)
    }
    const inputType = method.inputType
    if (inputType !== 'QueryParams' && inputType !== 'BodyParams' && inputType !== 'PathParams') {
      throw new BadRequestException(`Input type ${inputType} not supported`)
    }
    try {
      // update request count
      await this.prisma.providerV2.update({
        where: { code: providerId },
        data: { requestCount: { increment: 1 } }
      })
      if (methodType === 'GET') {
        if (inputType === 'QueryParams') {
          const queryParams = inputValues
            .map((value, index) => `${methodInputKeys[index]}=${value}`)
            .join('&')

          const response = await axios.get(`${endpointUrl}`, { headers, params: { ...input } })
          return response.data
        } else if (inputType === 'BodyParams') {
          const response = await axios.get(endpointUrl, { data: { ...input }, headers })
          return response.data
        } else if (inputType === 'PathParams') {
          for (const key in input) {
            endpointUrl = endpointUrl.replace(`${key}`, input[key])
          }
          const response = await axios.get(endpointUrl, { headers })
          return response.data
        }
      } else if (methodType === 'POST') {
        if (inputType === 'QueryParams') {
          const queryParams = inputValues
            .map((value, index) => `${methodInputKeys[index]}=${value}`)
            .join('&')
          const response = await axios.post(`${endpointUrl}?${queryParams}`, { headers })
          return response.data
        } else if (inputType === 'BodyParams') {
          const response = await axios.post(endpointUrl, inputValues, { headers })
          return response.data
        } else if (inputType === 'PathParams') {
          for (const key in input) {
            endpointUrl = endpointUrl.replace(`${key}`, input[key])
          }
          const response = await axios.post(endpointUrl, { headers })
          return response.data
        }
      }
    } catch (error) {
      console.error('Error executing method:', error)
      throw new BadRequestException(`Failed to execute method: ${error.message}`)
    }
  }

  async providerEndpointTest(apiKey: string, coinName: string) {
    if (apiKey !== '1234567890') {
      throw new BadRequestException('Invalid API key')
    }
    return {
      coinName,
      price: 1000
    }
  }

  async providerEndpointTest2(apiKey: string, coinName: string, price: number) {
    if (apiKey !== '1234567890') {
      throw new BadRequestException('Invalid API key')
    }
    return {
      coinName,
      marketCap: price * 100000000
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

  async submitProvider(walletAddress: string, submissionDto: SubmissionDto) {
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
      prUrl: submissionDto.prUrl,
      creator: walletAddress,
      category: {
        connect: {
          id: submissionDto.categoryId || 1
        }
      }
    }

    // check if the provider already exists
    const existingProvider = await this.prisma.providerV2.findUnique({
      where: {
        prUrl: submissionDto.prUrl
      }
    })

    if (existingProvider) {
      throw new BadRequestException('Provider already exists')
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
}
