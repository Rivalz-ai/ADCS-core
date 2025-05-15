import { Controller, Get, Param, ParseIntPipe, Post, Query, Body, Req } from '@nestjs/common'
import { ProviderService } from './provider.service'
import { ApiTags } from '@nestjs/swagger'
import { SubmissionDto } from './dto/submission.dto'
import { ExecuteMethodDto } from './dto/executeMethod.dto'
import { Request } from 'express'
@Controller({ path: 'providers', version: '1' })
@ApiTags('Providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async getAllProviders() {
    return await this.providerService.getAllProviders()
  }

  @Get('config')
  async getProviderConfig(@Query('url') url: string) {
    return await this.providerService.loadJsonConfig(url)
  }

  @Get('playground')
  async getPlayground(@Query('curl') curl: string) {
    return await this.providerService.playground(curl)
  }

  @Get('providerEndpointTest')
  async providerEndpointTest(@Req() req: Request, @Query('coinName') coinName: string) {
    const apiKey = req.headers['api-key'] as string
    return await this.providerService.providerEndpointTest(apiKey, coinName)
  }

  @Get(':id')
  async getProviderById(@Param('id', ParseIntPipe) id: number) {
    return await this.providerService.getProviderById(id)
  }

  @Post('submission')
  async submitProvider(@Body() submissionDto: SubmissionDto) {
    return await this.providerService.submitProvider(submissionDto)
  }

  @Get('allora/:coinName/:predictionType')
  async getAllora(
    @Param('coinName') coinName: string,
    @Param('predictionType') predictionType: string
  ) {
    return await this.providerService.alloraInference(coinName, predictionType)
  }

  @Post('verifySubmission')
  async verifySubmission(@Body() submissionDto: SubmissionDto) {
    return await this.providerService.verifySubmission(submissionDto)
  }

  @Post('executeMethod')
  async executeMethod(@Body() executeMethodDto: ExecuteMethodDto) {
    return await this.providerService.executeMethod(
      executeMethodDto.providerId,
      executeMethodDto.methodName,
      executeMethodDto.input
    )
  }
}
