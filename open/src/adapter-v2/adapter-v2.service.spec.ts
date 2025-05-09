import { Test, TestingModule } from '@nestjs/testing'
import { AdapterV2Service } from './adapter-v2.service'

describe('AdapterV2Service', () => {
  let service: AdapterV2Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdapterV2Service]
    }).compile()

    service = module.get<AdapterV2Service>(AdapterV2Service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
