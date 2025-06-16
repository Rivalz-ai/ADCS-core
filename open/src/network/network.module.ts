import { Module } from '@nestjs/common'
import { NetworkService } from './network.service'
import { NetworkController } from './network.controller'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [NetworkService, PrismaService],
  controllers: [NetworkController]
})
export class NetworkModule {}
