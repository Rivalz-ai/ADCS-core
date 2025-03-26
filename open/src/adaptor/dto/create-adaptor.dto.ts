import { IsString, IsNotEmpty, IsInt, Matches, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'



export enum ChainType {
  EVM = 'EVM',
  NON_EVM = 'NON_EVM',
}
export class CreateAdaptorDto {
  @ApiProperty({ description: 'The name of the adaptor' })
  @IsString()
  @IsNotEmpty()
  name: string
  chainType: ChainType;

  @ApiProperty({ description: 'The description of the adaptor' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ description: 'The variables of the adaptor, separated by commas' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+(,[a-zA-Z0-9_]+)*$/, {
    message: 'Variables must be alphanumeric strings separated by commas, with no spaces'
  })
  variables: string

  @ApiProperty({ description: 'The ID of the category this adaptor belongs to' })
  @IsInt()
  @IsNotEmpty()
  categoryId: number

  @ApiProperty({ description: 'The ID of the output type this adaptor uses' })
  @IsInt()
  @IsNotEmpty()
  outputTypeId: number

  @ApiProperty({ description: 'The ID of the data provider this adaptor uses' })
  @IsInt()
  @IsNotEmpty()
  dataProviderId: number

  @ApiProperty({ description: 'The ID of the chain this adaptor belongs to' })
  @IsInt()
  @IsNotEmpty()
  chainId: number

  @ApiProperty({ description: 'The AI prompt for the adaptor' })
  @IsString()
  @IsOptional()
  aiPrompt?: string
}