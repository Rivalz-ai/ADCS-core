import { Module } from '@nestjs/common'
import { ZeroService } from './zero.service'
import { ZeroController } from './zero.controller'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [ZeroService, PrismaService],
  controllers: [ZeroController]
})
export class ZeroModule {}
