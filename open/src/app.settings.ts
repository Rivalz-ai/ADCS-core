import { INestApplication, RequestMethod, VersioningType } from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()
export const MODE = process.env.MODE || 'dev'
export const RPC_URL = process.env.RPC_URL || ''

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const JWT_EXP = process.env.JWT_EXP || '1h'
export const JWT_API_EXP = process.env.JWT_API_EXP || '1y'
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = process.env.REDIS_PORT || '6379'
export const REDIS_USER = process.env.REDIS_USER || 'default'
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''

export const API_URL = process.env.API_URL || 'http://localhost:3010/fetcher/v1'

export const INFERENCE_API_URL = process.env.INFERENCE_API_URL || 'http://localhost:5000'
export const HOST = process.env.HOST || 'http://localhost:3001'
export const API_KEY_SECRET = process.env.API_KEY_SECRET || 'secret'

export function setAppSetting(app: INestApplication) {
  app.setGlobalPrefix('open', {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  })
  app.enableVersioning({
    type: VersioningType.URI
  })
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://rivalz.ai',
      'https://dev.rivalz.ai',
      /\.rivalz.ai$/,
      'https://adcsdev.rivalz.ai',
      'https://adcs.rivalz.ai',
      'https://testnet-adcs.rivalz.ai',
      'https://testnet-adcs-v2.rivalz.ai'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
}
console.log('Database URL:', process.env.DATABASE_URL)
console.log('API URL:', process.env.API_URL)
console.log('RPC URL:', process.env.RPC_URL)
console.log('APP PORT:', process.env.APP_PORT)
