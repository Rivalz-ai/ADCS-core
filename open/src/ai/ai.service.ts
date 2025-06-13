import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { decryptApiKey, encryptApiKey } from '../app.utils'
import { openai, anthropic, gemini, qwen, asi1 } from './ai.utils'

@Injectable()
export class AIService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllModels() {
    const models = await this.prismaService.aIModel.findMany({
      where: {
        active: true
      }
    })
    return models.map((model) => ({
      id: model.id,
      name: model.name,
      description: model.description
    }))
  }

  async executeModel(modelName: string, message: string) {
    const model = await this.prismaService.aIModel.findFirst({
      where: {
        name: modelName
      }
    })
    if (!model) {
      throw new Error('Model not found')
    }
    const key = decryptApiKey(model.apiKey)
    switch (model.type) {
      case 'openai':
        return await openai(key, model.name, message)
      case 'anthropic':
        return await anthropic(key, model.name, message)
      case 'gemini':
        return await gemini(key, model.name, message)
      case 'qwen':
        return await qwen(key, model.name, model.baseUrl, message)
      case 'asi1':
        return await asi1(key, model.name, model.baseUrl, message)
    }
  }

  async encrypt(apiKey: string) {
    return encryptApiKey(apiKey)
  }
}
