import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { ReporterService } from './reporter.service'
import { Reporter } from '@prisma/client'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateReporterDto } from './dto/create-reporter.dto'
import { UpdateReporterDto } from './dto/update-reporter.dto'

@ApiTags('Reporters')
@Controller({ path: 'reporters', version: '1' })
export class ReporterController {
  constructor(private readonly reporterService: ReporterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reporter' })
  @ApiResponse({ status: 201, description: 'The reporter has been successfully created.' })
  async createReporter(@Body() createReporterDto: CreateReporterDto): Promise<Reporter> {
    return await this.reporterService.createReporter(createReporterDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing reporter' })
  @ApiResponse({ status: 200, description: 'The reporter has been successfully updated.' })
  async updateReporter(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReporterDto: UpdateReporterDto
  ): Promise<Reporter> {
    return await this.reporterService.updateReporter(id, updateReporterDto)
  }

  @Get('by-contract-address')
  @ApiOperation({ summary: 'Get reporter by contract address' })
  @ApiResponse({ status: 200, description: 'Returns the reporter for the given contract address.' })
  async getReporterByContractAddress(
    @Query('contractAddress') contractAddress: string
  ): Promise<Reporter | null> {
    return await this.reporterService.getReporterByContractAddress(contractAddress)
  }

  @Get('by-chain-and-contract')
  @ApiOperation({ summary: 'Get reporter by chain ID and contract address' })
  @ApiResponse({
    status: 200,
    description: 'Returns the reporter for the given chain ID and contract address.'
  })
  async getReporterByChainAndContractAddress(
    @Query('chainId', ParseIntPipe) chainId: number,
    @Query('contractAddress') contractAddress: string
  ): Promise<Reporter | null> {
    return await this.reporterService.getReporterByChainAndContractAddress(chainId, contractAddress)
  }
}
