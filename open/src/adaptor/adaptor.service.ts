import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Adaptor } from '@prisma/client'
import { CreateAdaptorDto } from './dto/create-adaptor.dto'
import { UpdateAdaptorDto } from './dto/update-adaptor.dto'
import { randomBytes } from 'crypto'

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

  async createAdaptor(data: CreateAdaptorDto, creatorAddress: string): Promise<Adaptor> {
    const formattedVariables = this.validateAndFormatVariables(data.variables)
    // Generate a unique jobId compatible with Solidity bytes32
    // Generate the jobId before creating the adaptor
    const jobId = this.generateUniqueJobId()

    // Add the jobId to the data object
    const adaptorData = {
      ...data,
      jobId,
      variables: formattedVariables,
      createdBy: creatorAddress
    }
    return await this.prisma.adaptor.create({
      data: adaptorData
    })
  }

  async updateAdaptor(
    id: number,
    data: UpdateAdaptorDto,
    creatorAddress: string
  ): Promise<Adaptor> {
    const updateData = { ...data }
    if (data.variables) {
      updateData.variables = this.validateAndFormatVariables(data.variables)
    }
    const adaptor = await this.prisma.adaptor.findUnique({
      where: { id }
    })
    if (adaptor.createdBy !== creatorAddress) {
      throw new HttpException('You are not authorized to update this adaptor', HttpStatus.FORBIDDEN)
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
    const data = await this.prisma.adaptor.findMany({
      include: { category: true, outputType: true, chain: true }
    })

    return data.map((m) => {
      return {
        ...m,
        categoryName: m.category.name,
        outputTypeName: m.outputType.name,
        chainName: m.chain.name
      }
    })
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

  async getAdaptorByJobId(jobId: string): Promise<Adaptor> {
    return await this.prisma.adaptor.findFirst({
      where: { jobId },
      include: {
        outputType: true
      }
    })
  }

  generateUniqueJobId = (): string => {
    // Create a random 32-byte (256-bit) value
    const randomValue = randomBytes(32)
    // Convert to a hexadecimal string, prefixed with '0x'
    return '0x' + randomValue.toString('hex')
  }

  async category() {
    return await this.prisma.category.findMany()
  }

  async output() {
    return await this.prisma.outputType.findMany()
  }
}
