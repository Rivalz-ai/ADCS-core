import { Controller, Get } from '@nestjs/common'
import { InferenceService } from './inference.service'

@Controller('inference')
export class InferenceController {
  constructor(private inferenceService: InferenceService) {}

  @Get()
  async meme() {
    const data = await this.inferenceService.meme()
    return data
  }
}
