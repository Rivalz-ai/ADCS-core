import { Module } from '@nestjs/common'
import { AdapterV2Service } from './adapter-v2.service'
import { AdapterV2Controller } from './adapter-v2.controller'

@Module({
  providers: [AdapterV2Service],
  controllers: [AdapterV2Controller]
})
export class AdapterV2Module {}
