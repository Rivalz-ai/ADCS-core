import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEthereumAddress } from 'class-validator'

export class VerifySignatureDto {
  @ApiProperty({ description: 'Ethereum address of the user' })
  @IsEthereumAddress()
  address: string

  @ApiProperty({ description: 'Signature to verify' })
  @IsString()
  signature: string
}
