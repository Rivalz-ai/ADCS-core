import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateListenerDto {
  @ApiPropertyOptional({ description: 'The name of the listener' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'The contract address' })
  @IsString()
  @IsOptional()
  address?: string // Changed from contractAddress

  @ApiPropertyOptional({ description: 'The event name' })
  @IsString()
  @IsOptional()
  eventName?: string

  @ApiPropertyOptional({ description: 'The chain ID' })
  @IsInt()
  @IsOptional()
  chainId?: number

  @ApiPropertyOptional({ description: 'The service ID' })
  @IsInt()
  @IsOptional()
  serviceId?: number
}
