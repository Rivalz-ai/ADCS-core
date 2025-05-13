import { Module } from '@nestjs/common'
import { ProviderV2Service } from './provider-v2.service'
import { ProviderV2Controller } from './provider-v2.controller'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [ProviderV2Service, PrismaService],
  controllers: [ProviderV2Controller]
})
export class ProviderV2Module {}
