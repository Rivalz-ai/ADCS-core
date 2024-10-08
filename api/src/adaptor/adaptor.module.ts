import { Module } from '@nestjs/common'
import { AdaptorService } from './adaptor.service'
import { PrismaService } from '../prisma.service'
import { AdaptorController } from './adaptor.controller'

@Module({
  controllers: [AdaptorController],
  providers: [AdaptorService, PrismaService]
})
export class AdaptorModule {}
