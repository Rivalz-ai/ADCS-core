import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class VerifySignatureDto {
  @ApiProperty({ description: 'Message to verify' })
  @IsString()
  message: string

  @ApiProperty({ description: 'Signature to verify' })
  @IsString()
  signature: string
}
