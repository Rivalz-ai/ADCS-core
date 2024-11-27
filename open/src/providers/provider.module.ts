import { Module } from '@nestjs/common'
import { ProviderService } from './provider.service'
import { ProviderController } from './provider.controller'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [ProviderController],
  providers: [ProviderService, PrismaService],
  exports: [ProviderService]
})
export class ProviderModule {}
