import { Controller, Param, Post } from '@nestjs/common'
import { ZeroService } from './zero.service'

@Controller({ path: 'zero', version: '1' })
export class ZeroController {
  constructor(private readonly zeroService: ZeroService) {}

  @Post(':txHash/:rootHash')
  async add(@Param('txHash') txHash: string, @Param('rootHash') rootHash: string) {
    return await this.zeroService.add(txHash, rootHash)
  }
}
