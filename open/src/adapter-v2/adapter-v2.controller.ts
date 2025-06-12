import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { AdapterV2Service } from './adapter-v2.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateAdapterDto } from './dto/create.dto'
import { RunDto } from './dto/run.dto'
import { TestDto } from './dto/test.dto'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express'

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

  @Get('all')
  async getAllAdapters() {
    return await this.adapterV2Service.getAllAdapters()
  }

  @Get('by-code/:code')
  async getAdapterByCode(@Param('code') code: string) {
    return await this.adapterV2Service.getAdapter(code)
  }

  @Get('by-creator')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  async getAdapterByCreator(@Req() req: Request) {
    const user = req.user['walletAddress'] as string
    return await this.adapterV2Service.adapterByCreator(user)
  }

  @Post('create')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  async createAdapter(@Body() adapterDto: CreateAdapterDto, @Req() req: Request) {
    const user = req.user['walletAddress'] as string
    return await this.adapterV2Service.createAdapter(user, adapterDto)
  }

  @Post('verify')
  async verifyAdapter(@Body() adapterDto: CreateAdapterDto) {
    return await this.adapterV2Service.verifyAdapter(adapterDto)
  }

  @Delete('delete/:id')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  async deleteAdapter(@Param('id') id: string) {
    return await this.adapterV2Service.deleteAdapter(id)
  }

  @Post('run/:id')
  async runAdapter(@Param('id') id: string, @Body() runDto: RunDto) {
    return await this.adapterV2Service.runAdapterById(id, runDto.input)
  }

  @Post('test')
  async testAdapter(@Body() testDto: TestDto) {
    return await this.adapterV2Service.runTestAdapter(testDto.adaptor, testDto.input)
  }
}
