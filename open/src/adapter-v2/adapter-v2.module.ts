import { Module } from '@nestjs/common'
import { AdapterV2Service } from './adapter-v2.service'
import { AdapterV2Controller } from './adapter-v2.controller'
import { PrismaService } from '../prisma.service'
import { ProviderV2Module } from '../provider-v2/provider-v2.module'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [ProviderV2Module, AiModule],
  providers: [AdapterV2Service, PrismaService],
  controllers: [AdapterV2Controller]
})
export class AdapterV2Module {}
