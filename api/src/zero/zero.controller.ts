import { Controller, Param, Post } from '@nestjs/common'
import { ZeroService } from './zero.service'

@Controller('zero')
export class ZeroController {
  constructor(private readonly zeroService: ZeroService) {}

  @Post(':key')
  async add(@Param('key') key: string) {
    return await this.zeroService.add(key)
  }
}
