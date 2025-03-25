import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ZeroService {
  constructor(private readonly prismaService: PrismaService) {}

  async add(key: string) {
    return await this.prismaService.zeroGUploaded.create({
      data: {
        name: key,
        rootHash: key,
        createAt: new Date()
      }
    })
  }
}
