import { IsString, IsNotEmpty, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateReporterDto {
  @ApiProperty({ description: 'The name of the reporter' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'The contract address' })
  @IsString()
  @IsNotEmpty()
  contractAddress: string

  @ApiProperty({ description: 'The reporter address' })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({ description: 'The private key' })
  @IsString()
  @IsNotEmpty()
  privateKey: string

  @ApiProperty({ description: 'The chain ID' })
  @IsInt()
  @IsNotEmpty()
  chainId: number

  @ApiProperty({ description: 'The service ID' })
  @IsInt()
  @IsNotEmpty()
  serviceId: number
}
