import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateAdaptorDto {
  @ApiPropertyOptional({ description: 'The name of the adaptor' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'The description of the adaptor' })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ description: 'The variables of the adaptor in string format' })
  @IsString()
  @IsOptional()
  variables?: string

  @ApiPropertyOptional({ description: 'The ID of the category this adaptor belongs to' })
  @IsInt()
  @IsOptional()
  categoryId?: number

  @ApiPropertyOptional({ description: 'The ID of the output type this adaptor uses' })
  @IsInt()
  @IsOptional()
  outputTypeId?: number

  @ApiPropertyOptional({ description: 'The ID of the chain this adaptor belongs to' })
  @IsInt()
  @IsOptional()
  chainId?: number

  @ApiPropertyOptional({ description: 'The AI prompt for the adaptor' })
  @IsString()
  @IsOptional()
  aiPrompt?: string
}
