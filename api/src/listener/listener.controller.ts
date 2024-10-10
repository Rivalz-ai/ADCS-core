import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common'
import { ListenerService } from './listener.service'
import { Listener } from '@prisma/client'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateListenerDto } from './dto/create-listener.dto'
import { UpdateListenerDto } from './dto/update-listener.dto'

@ApiTags('Listeners')
@Controller({ path: 'listeners', version: '1' })
export class ListenerController {
  constructor(private readonly listenerService: ListenerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new listener' })
  @ApiResponse({ status: 201, description: 'The listener has been successfully created.' })
  async createListener(@Body() createListenerDto: CreateListenerDto): Promise<Listener> {
    return await this.listenerService.createListener(createListenerDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing listener' })
  @ApiResponse({ status: 200, description: 'The listener has been successfully updated.' })
  async updateListener(
    @Param('id') id: string,
    @Body() updateListenerDto: UpdateListenerDto
  ): Promise<Listener> {
    return await this.listenerService.updateListener(Number(id), updateListenerDto)
  }

  @Get('by-chain')
  @ApiOperation({ summary: 'Get listeners by chain name' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of listeners for the given chain name.'
  })
  async getListenersByChainName(@Query('chainName') chainName: string): Promise<Listener[]> {
    return await this.listenerService.getListenersByChainName(chainName)
  }

  @Get('by-service')
  @ApiOperation({ summary: 'Get listeners by service name' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of listeners for the given service name.'
  })
  async getListenersByServiceName(@Query('serviceName') serviceName: string): Promise<Listener[]> {
    return await this.listenerService.getListenersByServiceName(serviceName)
  }

  @Get()
  @ApiOperation({ summary: 'Get all listeners' })
  @ApiResponse({ status: 200, description: 'Returns a list of all listeners.' })
  async getAllListeners(): Promise<Listener[]> {
    return await this.listenerService.getAllListeners()
  }

  @Get('by-chain-and-service')
  @ApiOperation({ summary: 'Get listeners by chain name and service name' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of listeners for the given chain name and service name.'
  })
  async getListenersByChainAndService(
    @Query('chain') chainName: string,
    @Query('service') serviceName: string
  ): Promise<Listener[]> {
    return await this.listenerService.getListenersByChainAndService(chainName, serviceName)
  }
}
