import { ApiProperty } from '@nestjs/swagger'

export class Node {
  @ApiProperty({
    description: 'The id of the node',
    example: 'A1'
  })
  id: string

  @ApiProperty({
    description: 'The input of the node',
    example: 'IR.targetAsset'
  })
  input: string[]

  @ApiProperty({
    description: 'The input method of the node',
    example: 'method_name'
  })
  input_method: string

  @ApiProperty({
    description:
      'The output of the node (provider or adaptor). Example: OA1 means the output of the node is the output of the adaptor A1',
    example: 'OA1'
  })
  output: string
}

export class NodeDefinitionDto {
  @ApiProperty({
    description: 'The id of the node',
    example: 'A1'
  })
  id: string

  @ApiProperty({
    description: 'The source id of the node (provider or adaptor)',
    example: 'P0x...'
  })
  sourceId: string
}

export class CreateAdapterDto {
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
    description: 'The output type of the adapter',
    example: 1,
    required: false
  })
  output_type_id?: number

  @ApiProperty({
    description: 'The output type of the adapter',
    example: 1,
    required: false
  })
  category_id?: number

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
