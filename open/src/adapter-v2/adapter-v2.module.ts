import { Module } from '@nestjs/common'
import { AdapterV2Service } from './adapter-v2.service'
import { AdapterV2Controller } from './adapter-v2.controller'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [AdapterV2Service, PrismaService],
  controllers: [AdapterV2Controller]
})
export class AdapterV2Module {}
