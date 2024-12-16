import { Controller, Get, Param, Post, Body } from '@nestjs/common'
import { InferenceService } from './inference.service'

@Controller({ path: 'inference', version: '1' })
export class InferenceController {
  constructor(private inferenceService: InferenceService) {}

  @Get()
  async meme() {
    const data = await this.inferenceService.meme()
    return data
  }

  @Post('analyze/:model')
  async analyze(
    @Param('model') model: string,
    @Body() body: { content: string; dataTypeId: number }
  ) {
    const { content, dataTypeId } = body
    const data = await this.inferenceService.analyze(model, content, dataTypeId)
    return data
  }
}
