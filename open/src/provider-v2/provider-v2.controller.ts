import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ProviderV2Service } from './provider-v2.service'

@Controller({ path: 'provider', version: '2' })
@ApiTags('Providers')
export class ProviderV2Controller {
  constructor(private readonly providerV2Service: ProviderV2Service) {}

  @Get('all')
  async getAllProviders() {
    return await this.providerV2Service.getAllProviders()
  }

  @Get('byId/:id')
  async getProviderById(@Param('id') id: string) {
    return await this.providerV2Service.getProviderById(id)
  }

  @Get('structure')
  async getProviderStructure() {
    return await this.providerV2Service.providerStructure()
  }
}
