import { Controller, Get, Param, Post, Query, Req, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ProviderV2Service } from './provider-v2.service'
import { ExecuteMethodDto } from 'src/providers/dto/executeMethod.dto'

@Controller({ path: 'providers', version: '2' })
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

  @Get('providerEndpointTest')
  async providerEndpointTest(@Req() req: Request, @Query('coinName') coinName: string) {
    const apiKey = req.headers['api-key'] as string
    return await this.providerV2Service.providerEndpointTest(apiKey, coinName)
  }

  @Get('providerEndpointTest2')
  async providerEndpointTest2(
    @Req() req: Request,
    @Query('coinName') coinName: string,
    @Query('price') price: number
  ) {
    const apiKey = req.headers['api-key'] as string
    return await this.providerV2Service.providerEndpointTest2(apiKey, coinName, price)
  }

  @Post('executeMethod')
  async executeMethod(@Body() executeMethodDto: ExecuteMethodDto) {
    return await this.providerV2Service.executeMethod(
      executeMethodDto.providerId,
      executeMethodDto.methodName,
      executeMethodDto.input
    )
  }
}
