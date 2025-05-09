export const graphStructure = {
  nodes: { P1: 'provider_id', A1: 'adapter_id', A2: 'adapter_id' },
  graph_flow: [
    { id: 'P1', input: 'IR.key1', input_method: 'method_name', output: 'OP1' },
    { id: 'A1', input: 'OP1', input_method: 'method_name', output: 'OA1' },
    { id: 'A2', input: 'OA1', input_method: 'method_name', output: 'OA2' }
  ]
}
