import { ApiProperty } from '@nestjs/swagger'

export class ExecuteMethodDto {
  @ApiProperty({ description: 'Provider ID' })
  providerId: string

  @ApiProperty({ description: 'Method name' })
  methodName: string

  @ApiProperty({ description: 'Input' })
  input: { [key: string]: any }
}
