import { IsString, IsNotEmpty, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateListenerDto {
  @ApiProperty({ description: 'The name of the listener' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'The contract address' })
  @IsString()
  @IsNotEmpty()
  address: string // Changed from contractAddress

  @ApiProperty({ description: 'The event name' })
  @IsString()
  @IsNotEmpty()
  eventName: string

  @ApiProperty({ description: 'The chain ID' })
  @IsInt()
  @IsNotEmpty()
  chainId: number

  @ApiProperty({ description: 'The service ID' })
  @IsInt()
  @IsNotEmpty()
  serviceId: number
}
