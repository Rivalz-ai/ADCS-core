import { Test, TestingModule } from '@nestjs/testing'
import { ProviderV2Service } from './provider-v2.service'

describe('ProviderV2Service', () => {
  let service: ProviderV2Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderV2Service]
    }).compile()

    service = module.get<ProviderV2Service>(ProviderV2Service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
