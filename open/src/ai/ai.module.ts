import { Module } from '@nestjs/common'
import { AIService } from './ai.service'
import { AIController } from './ai.controller'
import { PrismaService } from '../prisma.service'
@Module({
  providers: [AIService, PrismaService],
  controllers: [AIController]
})
export class AiModule {}
