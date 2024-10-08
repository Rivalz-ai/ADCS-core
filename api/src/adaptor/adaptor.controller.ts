import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe
} from '@nestjs/common'
import { AdaptorService } from './adaptor.service'
import { Adaptor } from '@prisma/client'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateAdaptorDto } from './dto/create-adaptor.dto'
import { UpdateAdaptorDto } from './dto/update-adaptor.dto'

@ApiTags('Adaptors')
@Controller({ path: 'adaptors', version: '1' })
export class AdaptorController {
  constructor(private readonly adaptorService: AdaptorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new adaptor' })
  @ApiResponse({
    status: 201,
    description: 'The adaptor has been successfully created.'
  })
  async createAdaptor(@Body() createAdaptorDto: CreateAdaptorDto): Promise<Adaptor> {
    return await this.adaptorService.createAdaptor(createAdaptorDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing adaptor' })
  @ApiResponse({
    status: 200,
    description: 'The adaptor has been successfully updated.'
  })
  async updateAdaptor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdaptorDto: UpdateAdaptorDto
  ): Promise<Adaptor> {
    return await this.adaptorService.updateAdaptor(id, updateAdaptorDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an adaptor' })
  @ApiResponse({
    status: 200,
    description: 'The adaptor has been successfully removed.'
  })
  async removeAdaptor(@Param('id', ParseIntPipe) id: number): Promise<Adaptor> {
    return await this.adaptorService.removeAdaptor(id)
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
}
