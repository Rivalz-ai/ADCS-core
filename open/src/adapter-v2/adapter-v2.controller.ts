import { Controller, Get } from '@nestjs/common'
import { AdapterV2Service } from './adapter-v2.service'
import { ApiTags } from '@nestjs/swagger'

@Controller({ path: 'adapter', version: '2' })
@ApiTags('Adaptors')
export class AdapterV2Controller {
  constructor(private readonly adapterV2Service: AdapterV2Service) {}

  @Get('structure')
  async getAdapterStructure() {
    return await this.adapterV2Service.getAdapterStructure()
  }

  @Get('graph')
  async getGraphStructure() {
    return await this.adapterV2Service.getGraphStructure()
  }
}
