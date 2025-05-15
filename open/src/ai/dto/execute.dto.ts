import { ApiProperty } from '@nestjs/swagger'

export class ExecuteDto {
  @ApiProperty({
    description: 'The model to use',
    example: 'gpt-3.5-turbo'
  })
  model: string

  @ApiProperty({
    description: 'The message to send to the model',
    example: 'Hello, how are you?'
  })
  message: string
}
