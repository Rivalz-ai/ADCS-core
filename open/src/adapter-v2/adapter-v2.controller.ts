import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { AdapterV2Service } from './adapter-v2.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateAdapterDto } from './dto/create.dto'
import { RunDto } from './dto/run.dto'

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

  @Post('create')
  async createAdapter(@Body() adapterDto: CreateAdapterDto) {
    return await this.adapterV2Service.createAdapter(adapterDto)
  }

  @Post('verify')
  async verifyAdapter(@Body() adapterDto: CreateAdapterDto) {
    return await this.adapterV2Service.verifyAdapter(adapterDto)
  }

  @Delete('delete/:id')
  async deleteAdapter(@Param('id') id: string) {
    return await this.adapterV2Service.deleteAdapter(id)
  }

  @Post('run/:id')
  async runAdapter(@Param('id') id: string, @Body() runDto: RunDto) {
    return await this.adapterV2Service.runAdapterById(id, runDto.input)
  }
}
