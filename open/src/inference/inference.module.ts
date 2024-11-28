import { Module } from '@nestjs/common'
import { InferenceService } from './inference.service'
import { InferenceController } from './inference.controller'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [InferenceService, PrismaService],
  controllers: [InferenceController]
})
export class InferenceModule {}
