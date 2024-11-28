import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req
} from '@nestjs/common'
import { AdaptorService } from './adaptor.service'
import { Adaptor } from '@prisma/client'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CreateAdaptorDto } from './dto/create-adaptor.dto'
import { UpdateAdaptorDto } from './dto/update-adaptor.dto'
import { JwtAuthGuard } from '../auth/auth.guard'
import { Request } from 'express'

@ApiTags('Adaptors')
@Controller({ path: 'adaptors', version: '1' })
export class AdaptorController {
  constructor(private readonly adaptorService: AdaptorService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new adaptor' })
  @ApiResponse({
    status: 201,
    description: 'The adaptor has been successfully created.'
  })
  async createAdaptor(
    @Body() createAdaptorDto: CreateAdaptorDto,
    @Req() req: Request
  ): Promise<Adaptor> {
    return await this.adaptorService.createAdaptor(createAdaptorDto, req.user['address'])
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update an existing adaptor' })
  @ApiResponse({
    status: 200,
    description: 'The adaptor has been successfully updated.'
  })
  async updateAdaptor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdaptorDto: UpdateAdaptorDto,
    @Req() req: Request
  ): Promise<Adaptor> {
    return await this.adaptorService.updateAdaptor(id, updateAdaptorDto, req.user['address'])
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Remove an adaptor' })
  @ApiResponse({
    status: 200,
    description: 'The adaptor has been successfully removed.'
  })
  async removeAdaptor(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ): Promise<Adaptor> {
    return await this.adaptorService.removeAdaptor(id, req.user['address'])
  }

  @Get()
  @ApiOperation({ summary: 'Get all adaptors' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all adaptors.'
  })
  async getAdaptorList(): Promise<Adaptor[]> {
    return await this.adaptorService.getAdaptorList()
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get adaptors by category ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of adaptors for the given category ID.'
  })
  async getAdaptorsByCategoryId(
    @Query('categoryId', ParseIntPipe) categoryId: number
  ): Promise<Adaptor[]> {
    return await this.adaptorService.getAdaptorsByCategoryId(categoryId)
  }

  @Get('by-output-type')
  @ApiOperation({ summary: 'Get adaptors by output type ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of adaptors for the given output type ID.'
  })
  async getAdaptorsByOutputTypeId(
    @Query('outputTypeId', ParseIntPipe) outputTypeId: number
  ): Promise<Adaptor[]> {
    return await this.adaptorService.getAdaptorsByOutputTypeId(outputTypeId)
  }

  @Get('by-job-id')
  @ApiOperation({ summary: 'Get adaptor by job ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the adaptor for the given job ID.'
  })
  async getAdaptorByJobId(@Query('jobId') jobId: string): Promise<Adaptor> {
    return await this.adaptorService.getAdaptorByJobId(jobId)
  }

  @Get('category')
  async category() {
    return await this.adaptorService.category()
  }

  @Get('outputType')
  async outputType() {
    return await this.adaptorService.output()
  }

  @Get('chain')
  async chain() {
    return await this.adaptorService.chain()
  }

  @Get('by-address')
  async byAddress(@Query('address') address: string) {
    return await this.adaptorService.byAddress(address)
  }
}
