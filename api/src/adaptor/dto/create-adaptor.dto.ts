import { IsString, IsNotEmpty, IsInt, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAdaptorDto {
  @ApiProperty({ description: 'The name of the adaptor' })
  @IsString()
  @IsNotEmpty()
  name: string

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
}
