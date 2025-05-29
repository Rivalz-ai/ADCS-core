import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class SubmissionDto {
  @IsString()
  @ApiProperty({
    description: 'The URL of the API endpoint to submit the request to',
    example: 'https://api.example.com/endpoint'
  })
  url: string

  @IsString()
  @ApiProperty({
    description: 'The API key to submit the request to',
    example: { 'api-key': '1234567890' }
  })
  apiKey: string

  @IsString()
  @ApiProperty({
    description: 'The PR url of the request to submit',
    example: 'https://github.com/org/repo/pull/1'
  })
  prUrl: string

  @ApiProperty({
    description: 'The category id of the request to submit',
    example: 1,
    required: false
  })
  categoryId?: number

  @IsString()
  @ApiProperty({
    description: 'The document link of the request to submit',
    example: 'https://docs.example.com',
    required: false
  })
  documentLink?: string

  @IsString()
  @ApiProperty({
    description: 'The config url of the request to submit',
    example:
      'https://raw.githubusercontent.com/Rivalz-ai/ADCS-core/refs/heads/52-provider-submission-api/open/providers/example.json'
  })
  configUrl: string
}
