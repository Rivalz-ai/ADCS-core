import { ApiProperty } from '@nestjs/swagger'
import { Node } from './create.dto'

export class UpdateAdapterDto {
  @ApiProperty({
    description: 'The name of the adapter',
    example: 'Adapter 1'
  })
  name: string

  @ApiProperty({
    description: 'The description of the adapter',
    example: 'Adapter 1 description'
  })
  description: string

  @ApiProperty({
    description: 'The icon of the adapter',
    example: 'Adapter 1 icon'
  })
  icon: string

  @ApiProperty({
    description: 'The core LLM of the adapter',
    example: 'chatgpt'
  })
  core_llm?: string

  @ApiProperty({
    description: 'The static context of the adapter',
    example: 'context for LLM'
  })
  static_context?: string

  @ApiProperty({
    description: 'The input schema of the adapter',
    example: { targetAsset: 'string' },
    type: Object
  })
  input_schema: { [key: string]: string }

  @ApiProperty({
    description: 'The output schema of the adapter',
    example: { recommendation: 'string', riskScore: 'number' },
    type: Object
  })
  output_schema: { [key: string]: string }

  @ApiProperty({
    description: 'The nodes of the adapter',
    example: { A1: 'P0x...', A2: 'A1' },
    type: Object
  })
  nodes: { [key: string]: string }

  @ApiProperty({
    description: 'The graph flow of the adapter',
    example: [{ id: 'A1', input: ['IR.targetAsset'], input_method: 'method_name', output: 'OA1' }],
    type: [Node]
  })
  graph_flow: Node[]
}
