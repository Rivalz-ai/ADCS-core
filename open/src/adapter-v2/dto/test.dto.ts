import { ApiProperty } from '@nestjs/swagger'
import { CreateAdapterDto } from './create.dto'

export class TestDto {
  @ApiProperty({
    description: 'The adaptor',
    type: CreateAdapterDto
  })
  adaptor: CreateAdapterDto

  @ApiProperty({
    description: 'The input of the adapter',
    example: { targetAsset: 'string' },
    type: Object
  })
  input: { [key: string]: any }
}
