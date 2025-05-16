import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsString, IsUUID } from 'class-validator'

import { IsNotEmpty } from 'class-validator'

export class RunDto {
  @ApiProperty({
    description: 'The input to run the adapter with',
    example: { key: 'value' },
    type: Object
  })
  @IsObject()
  @IsNotEmpty()
  input: { [key: string]: any }
}
