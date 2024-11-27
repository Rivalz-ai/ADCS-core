import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ProviderService } from './provider.service'

@Controller({ path: 'providers', version: '1' })
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async getAllProviders() {
    return await this.providerService.getAllProviders()
  }

  @Get(':id')
  async getProviderById(@Param('id', ParseIntPipe) id: number) {
    return await this.providerService.getProviderById(id)
  }
}
