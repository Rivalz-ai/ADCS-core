import { Controller, Param, Post, Body, Get } from '@nestjs/common'
import { AIService } from './ai.service'
import { ExecuteDto } from './dto/execute.dto'

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('models')
  async getModels() {
    return await this.aiService.getAllModels()
  }

  @Post('execute')
  async execute(@Body() body: ExecuteDto) {
    return await this.aiService.executeModel(body.model, body.message)
  }

  @Post('encrypt/:apiKey')
  async encrypt(@Param('apiKey') apiKey: string) {
    return await this.aiService.encrypt(apiKey)
  }
}
