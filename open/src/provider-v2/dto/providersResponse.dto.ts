export class ProvidersResponseDto {
  id: string
  name: string
  description: string
  iconUrl: string
  documentLink: string
  createdAt: Date
  updatedAt: Date
  methods: Method[]
}

export class Method {
  id: string
  name: string
  description: string
  inputSchema: JSON
  inputType: string
  outputSchema: JSON
  playground: string
  type: string
}
