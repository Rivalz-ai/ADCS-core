import { Controller, Get } from '@nestjs/common'
import { InferenceService } from './inference.service'

@Controller({ path: 'inference', version: '1' })
export class InferenceController {
  constructor(private inferenceService: InferenceService) {}

  @Get('meme')
  async meme() {
    return {
      market_research: 'market_research',
      memecoins_data: 'memecoins_data',
      final_decision: {
        token_name: 'Dogecoin',
        decision: true
      }
    }
    const data = await this.inferenceService.meme()
    return data
  }
}
