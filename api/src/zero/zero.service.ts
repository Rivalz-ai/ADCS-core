import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ZeroService {
  constructor(private readonly prismaService: PrismaService) {}

  async add(txHash: string, rootHash: string) {
    return await this.prismaService.zeroGUploaded.create({
      data: {
        name: txHash,
        rootHash: rootHash,
        createdAt: new Date()
      }
    })
  }
}
