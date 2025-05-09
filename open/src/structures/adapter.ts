export const adapterStructure = {
  id: 'id',
  name: 'name',
  description: 'description',
  icon: 'icon_url',
  core_llm: 'llm_name',
  static_context: 'static_context',
  input_schema: { targetAsset: 'string' },
  output_schema: { recommendation: 'string', riskScore: 'number' },
  nodes: { P1: 'provider_id', A1: 'adapter_id' },
  graph_flow: [
    {
      id: 'A1',
      input: ['IR.targetAsset'],
      input_method: 'method_name',
      output: 'OA1'
    },
    {
      id: 'P1',
      input: ['IR.targetAsset'],
      input_method: 'method_name',
      output: 'OP1'
    },
    {
      id: 'P1',
      input: ['IR.targetAsset'],
      input_method: 'method_name',
      output: 'OP2'
    }
  ]
}
