export const providerStructure = {
  id: '1',
  name: 'get price',
  description: 'description for provider',
  icon_url: 'https://getprice.api.com',
  methods: [
    {
      method_name: 'method 1',
      description: 'description for method 1',
      input_schema: { coinName: 'string' },
      input_type: 'QueryParams',
      output_schema: { coinName: 'string', price: 'number' },
      type: 'GET',
      playground: 'https://getprice.api.com?coinName=BTC'
    },
    {
      method_name: 'getMarket',
      description: 'description for method 2',
      input_schema: { coinName: 'string' },
      input_type: 'QueryParams',
      output_schema: { coinName: 'string', mc: 'number' },
      type: 'GET',
      playground: 'https://api.com/getMarket?coinName=BTC'
    }
  ]
}
