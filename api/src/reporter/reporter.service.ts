import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Reporter, Prisma } from '@prisma/client'

@Injectable()
export class ReporterService {
  constructor(private prisma: PrismaService) {}

  async createReporter(data: Prisma.ReporterUncheckedCreateInput): Promise<Reporter> {
    return await this.prisma.reporter.create({ data })
  }

  async updateReporter(id: number, data: Prisma.ReporterUpdateInput): Promise<Reporter> {
    return await this.prisma.reporter.update({
      where: { id },
      data
    })
  }

  async getReporterByContractAddress(contractAddress: string): Promise<Reporter | null> {
    return await this.prisma.reporter.findFirst({
      where: { contractAddress }
    })
  }

  async getReporterByChainAndContractAddress(
    chainName: string,
    contractAddress: string
  ): Promise<Reporter[] | null> {
    const reporters = await this.prisma.reporter.findMany({
      where: {
        AND: [{ chain: { name: chainName } }, { contractAddress }]
      }
    })

    const reportersWithRpcs = await Promise.all(
      reporters.map(async (reporter) => {
        const rpcs = await this.prisma.chainRpc.findMany({
          where: { chainId: reporter.chainId }
        })
        return {
          ...reporter,
          chainRpcs: rpcs
        }
      })
    )
    return reportersWithRpcs
  }
}
