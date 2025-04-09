import { parseArgs } from 'node:util'
import { buildLogger } from '../logger'
import { buildListener as buildADCSListener } from './adcs'
import { RivalzError, RivalzErrorCode } from '../errors'
import { hookConsoleError } from '../utils'
import { IListenersV2 } from './types'
import express, { Request, Response } from 'express'
import { LISTENER_V2_PORT } from '../settings'
const app = express()

const LISTENERS: IListenersV2 = {
  ADCS: buildADCSListener
}

const FILE_NAME = import.meta.url
const LOGGER = buildLogger('listener')

async function main() {
  hookConsoleError(LOGGER)
  const service = loadArgs()

  if (!LISTENERS[service]) {
    LOGGER.error({ name: 'listener:main', file: FILE_NAME, service }, 'service')
    throw new RivalzError(RivalzErrorCode.UndefinedListenerRequested)
  }
  LISTENERS[service](LOGGER)
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
