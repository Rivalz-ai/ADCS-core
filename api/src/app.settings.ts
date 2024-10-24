import { INestApplication, RequestMethod, VersioningType } from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()
export const MODE = process.env.MODE || 'dev'
export const RPC_URL = process.env.RPC_URL || ''

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const JWT_EXP = process.env.JWT_EXP || '1h'

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = process.env.REDIS_PORT || '6379'

export const INFERENCE_API_URL = process.env.INFERENCE_API_URL || 'http://localhost:5000'

export function setAppSetting(app: INestApplication) {
  app.setGlobalPrefix('adcs', {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  })
  app.enableVersioning({
    type: VersioningType.URI
  })
  app.enableCors({
    origin: ['http://localhost:3000', 'https://rivalz.ai', 'https://dev.rivalz.ai', /\.rivalz.ai$/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
}
