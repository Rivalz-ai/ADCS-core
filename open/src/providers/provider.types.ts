export interface IProvider {
  id: string
  name: string
  description: string
  icon_url: string
  methods: IMethod[]
}

export interface IMethod {
  method_name: string
  description: string
  input_schema: JSON
  input_type: InputType
  output_schema: JSON
  playground: string
  type: string
}

export type InputType = 'QueryParams' | 'BodyParams'
