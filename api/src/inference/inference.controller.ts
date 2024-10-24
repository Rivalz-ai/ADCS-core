import { Controller, Get } from '@nestjs/common'
import { InferenceService } from './inference.service'

@Controller({ path: 'inference', version: '1' })
export class InferenceController {
  constructor(private inferenceService: InferenceService) {}

  @Get('meme')
  async meme() {
    const data = await this.inferenceService.meme()
    return data
  }
}
