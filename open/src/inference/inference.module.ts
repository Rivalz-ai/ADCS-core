import { Module } from '@nestjs/common'
import { InferenceService } from './inference.service'
import { InferenceController } from './inference.controller'

@Module({
  providers: [InferenceService],
  controllers: [InferenceController]
})
export class InferenceModule {}
