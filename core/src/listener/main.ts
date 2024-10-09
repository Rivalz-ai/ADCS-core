import { parseArgs } from 'node:util'
import type { RedisClientType } from 'redis'
import { buildLogger } from '../logger'
import { buildListener as buildADCSListener } from './adcs'
import { postprocessListeners } from './utils'
import { RivalzError, RivalzErrorCode } from '../errors'
import { CHAIN, REDIS_HOST, REDIS_PORT } from '../settings'
import { getListeners } from './api'
import { hookConsoleError } from '../utils'
import { IListeners } from './types'
import { createClient } from 'redis'

const LISTENERS: IListeners = {
  ADCS: buildADCSListener
}

const FILE_NAME = import.meta.url
const LOGGER = buildLogger('listener')

async function main() {
  hookConsoleError(LOGGER)
  const service = loadArgs()

  const listenersRawConfig = await getListeners({ service, chain: CHAIN })
  const listenersConfig = postprocessListeners({
    listenersRawConfig,
    service,
    chain: CHAIN,
    logger: LOGGER
  })
  console.log('config', service, listenersConfig[service], LISTENERS[service])

  if (!LISTENERS[service] || !listenersConfig[service]) {
    LOGGER.error({ name: 'listener:main', file: FILE_NAME, service }, 'service')
    throw new RivalzError(RivalzErrorCode.UndefinedListenerRequested)
  }

  const redisClient: RedisClientType = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` })

  await redisClient.connect()

  LISTENERS[service](listenersConfig[service], redisClient, LOGGER)
  LOGGER.info('Listener launched')
}

function loadArgs(): string {
  const {
    values: { service }
  } = parseArgs({
    options: {
      service: {
        type: 'string'
      }
    }
  })

  if (!service) {
    throw Error('Missing --service argument.')
  }

  if (!Object.keys(LISTENERS).includes(service)) {
    throw Error(`${service} is not supported service.`)
  }

  return service
}

main().catch((e) => {
  LOGGER.error(e)
  process.exitCode = 1
})
