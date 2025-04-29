import { Type } from 'class-transformer'
import { IsString, IsArray, IsObject, ValidateNested, IsIn } from 'class-validator'

export class MethodDto {
  @IsString()
  method_name: string

  @IsString()
  description: string

  @IsObject()
  input_schema: Record<string, any>

  @IsIn(['QueryParams', 'BodyParams'])
  input_type: 'QueryParams' | 'BodyParams'

  @IsObject()
  output_schema: Record<string, any>

  @IsString()
  type: 'GET' | 'POST'

  @IsString()
  playground: string
}

export class ProviderDto {
  @IsString()
  id: string

  @IsString()
  name: string

  @IsString()
  description: string

  @IsString()
  icon_url: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MethodDto)
  methods: MethodDto[]
}
