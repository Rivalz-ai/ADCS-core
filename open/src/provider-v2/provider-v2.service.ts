import { BadRequestException, Injectable, Post } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { providerStructure } from '../structures/provider'
import axios from 'axios'
import { decryptApiKey } from 'src/app.utils'
import { ExecuteMethodDto } from 'src/providers/dto/executeMethod.dto'

@Injectable()
export class ProviderV2Service {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProviders() {
    const data = await this.prisma.providerV2.findMany({
      include: {
        ProviderMethod: { include: { inputEntity: true, outputEntity: true } }
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
        })
      }
    })
  }

  async getProviderById(id: string) {
    const data = await this.prisma.providerV2.findUnique({
      where: { code: id },
      include: { ProviderMethod: { include: { inputEntity: true, outputEntity: true } } }
    })

    return {
      id: data.code,
      name: data.name,
      description: data.description,
      iconUrl: data.iconUrl,
      documentLink: data.documentLink,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
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
      })
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
    const apiKey = decryptApiKey(provider.apiKey)
    const headers = {
      'Content-Type': 'application/json',
      ...JSON.parse(apiKey)
    }
    const inputType = method.inputType
    if (inputType !== 'QueryParams' && inputType !== 'BodyParams') {
      throw new BadRequestException(`Input type ${inputType} not supported`)
    }
    try {
      if (methodType === 'GET') {
        if (inputType === 'QueryParams') {
          const queryParams = inputValues
            .map((value, index) => `${methodInputKeys[index]}=${value}`)
            .join('&')

          const response = await axios.get(`${endpointUrl}?${queryParams}`, { headers })
          return response.data
        } else if (inputType === 'BodyParams') {
          const response = await axios.get(endpointUrl, { data: inputValues, headers })
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
}
