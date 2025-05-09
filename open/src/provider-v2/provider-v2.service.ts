import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { providerStructure } from '../structures/provider'

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
}
