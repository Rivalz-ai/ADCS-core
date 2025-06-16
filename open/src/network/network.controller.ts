import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { NetworkService } from './network.service'

@Controller({ path: 'network', version: '1' })
@ApiTags('Network')
export class NetworkController {
  constructor(private networkService: NetworkService) {}

  @Get('list')
  async getNetworkInfo() {
    return await this.networkService.list()
  }
}
