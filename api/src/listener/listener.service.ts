import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Listener, Prisma } from '@prisma/client'

@Injectable()
export class ListenerService {
  constructor(private prisma: PrismaService) {}

  async createListener(data: Prisma.ListenerUncheckedCreateInput): Promise<Listener> {
    return await this.prisma.listener.create({ data })
  }

  async updateListener(id: number, data: Prisma.ListenerUpdateInput): Promise<Listener> {
    return await this.prisma.listener.update({
      where: { id },
      data
    })
  }

  async getListenersByChainName(chainName: string): Promise<Listener[]> {
    return await this.prisma.listener.findMany({
      where: { chain: { name: chainName } },
      include: { chain: true, service: true }
    })
  }

  async getListenersByServiceName(serviceName: string): Promise<Listener[]> {
    return await this.prisma.listener.findMany({
      where: { service: { name: serviceName } },
      include: { chain: true, service: true }
    })
  }

  async getAllListeners(): Promise<Listener[]> {
    return await this.prisma.listener.findMany({
      include: { chain: true, service: true }
    })
  }

  async getListenersByChainAndService(chainName: string, serviceName: string): Promise<Listener[]> {
    return await this.prisma.listener.findMany({
      where: {
        chain: { name: chainName },
        service: { name: serviceName }
      },
      include: { chain: true, service: true }
    })
  }
}
