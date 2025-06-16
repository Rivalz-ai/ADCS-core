import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class NetworkService {
  constructor(private prismaService: PrismaService) {}

  async list() {
    const chains = await this.prismaService.chain.findMany({
      include: {
        reporters: true
      }
    })

    return chains.map((chain) => ({
      id: chain.id,
      name: chain.name,
      type: chain.type,
      iconUrl: chain.iconUrl,
      docsUrl: chain.docsUrl,
      coordinatorAddress: chain.reporters[0].contractAddress
    }))
  }
}
