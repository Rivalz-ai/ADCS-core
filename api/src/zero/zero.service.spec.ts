import { Test, TestingModule } from '@nestjs/testing'
import { ZeroService } from './zero.service'

describe('ZeroService', () => {
  let service: ZeroService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZeroService]
    }).compile()

    service = module.get<ZeroService>(ZeroService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
