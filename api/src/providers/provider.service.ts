import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { HOST } from '../app.settings'

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
          createdAt: true,
          updatedAt: true
        }
      })
      return providers.map((provider) => ({
        ...provider
      }))
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
        ...provider
      }
    } catch (error) {
      console.error(`Error fetching provider with id ${id}:`, error)
      throw error
    }
  }
}
