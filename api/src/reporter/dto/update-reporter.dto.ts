import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateReporterDto {
  @ApiPropertyOptional({ description: 'The name of the reporter' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'The contract address' })
  @IsString()
  @IsOptional()
  contractAddress?: string

  @ApiPropertyOptional({ description: 'The reporter address' })
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ description: 'The private key' })
  @IsString()
  @IsOptional()
  privateKey?: string

  @ApiPropertyOptional({ description: 'The chain ID' })
  @IsInt()
  @IsOptional()
  chainId?: number

  @ApiPropertyOptional({ description: 'The service ID' })
  @IsInt()
  @IsOptional()
  serviceId?: number
}
