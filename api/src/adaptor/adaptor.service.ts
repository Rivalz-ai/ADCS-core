import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Adaptor } from '@prisma/client'
import { CreateAdaptorDto } from './dto/create-adaptor.dto'
import { UpdateAdaptorDto } from './dto/update-adaptor.dto'

@Injectable()
export class AdaptorService {
  constructor(private prisma: PrismaService) {}

  private validateAndFormatVariables(variables: string): string {
    const trimmedVars = variables
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '')
    if (trimmedVars.length === 0) {
      throw new BadRequestException('Variables must not be empty')
    }
    return trimmedVars.join(',')
  }

  async createAdaptor(data: CreateAdaptorDto): Promise<Adaptor> {
    const formattedVariables = this.validateAndFormatVariables(data.variables)
    return await this.prisma.adaptor.create({
      data: {
        ...data,
        variables: formattedVariables
      }
    })
  }

  async updateAdaptor(id: number, data: UpdateAdaptorDto): Promise<Adaptor> {
    let updateData = { ...data }
    if (data.variables) {
      updateData.variables = this.validateAndFormatVariables(data.variables)
    }
    return await this.prisma.adaptor.update({
      where: { id },
      data: updateData
    })
  }

  async removeAdaptor(id: number): Promise<Adaptor> {
    return await this.prisma.adaptor.delete({
      where: { id }
    })
  }

  async getAdaptorList(): Promise<Adaptor[]> {
    return await this.prisma.adaptor.findMany()
  }

  async getAdaptorsByCategoryId(categoryId: number): Promise<Adaptor[]> {
    return await this.prisma.adaptor.findMany({
      where: { categoryId }
    })
  }

  async getAdaptorsByOutputTypeId(outputTypeId: number): Promise<Adaptor[]> {
    return await this.prisma.adaptor.findMany({
      where: { outputTypeId }
    })
  }
}
