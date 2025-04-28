import { Interface, Log } from 'ethers'
import { Logger } from 'pino'
import { listenerServiceV2 } from './listener'
import { IDataRequested, IADCSListenerWorker } from '../types'
import {
  IProcessEventListenerJob,
  IProcessEventListenerJobV2,
  ProcessEventOutputType
} from './types'
import {
  LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME,
  WORKER_ADCS_QUEUE_NAME,
  BULLMQ_CONNECTION,
  LISTENER_JOB_SETTINGS,
  LISTENER_V2_PORT,
  WEBHOOK_KEY
} from '../settings'
import { ADCS_ABI } from '../constants/adcs.coordinator.abi'
import { Queue } from 'bullmq'
import { getUniqueEventIdentifier } from './utils'
import express, { Request, Response } from 'express'
const FILE_NAME = import.meta.url

export async function buildListener(logger: Logger) {
  const processEventQueueName = LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME
  const workerQueueName = WORKER_ADCS_QUEUE_NAME
  const iface = new Interface(ADCS_ABI)
  const app = express()

  listenerServiceV2({
    processEventQueueName,
    workerQueueName,
    processFn: await processEvent({ iface, logger }),
    logger
  })

  app.post('/events', async (req: Request, res: Response) => {
    logger.debug('/events')
    try {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        const key = req.headers['rivalz-key']
        if (key !== WEBHOOK_KEY) {
          res.status(401).send('Unauthorized')
          return
        }
        const data = JSON.parse(body)
        if (data && data.events && data.events.length > 0) {
          adcsStreamListener({ chain: data.chain, events: data.events, iface })
        }
        res.status(200).send('Webhook received')
      })
    } catch (e) {
      logger.error(e)
      res.status(500).send(e)
    }
  })

  app.listen(LISTENER_V2_PORT, () => {
    logger.info(`Listener v2 listening on port ${LISTENER_V2_PORT}`)
  })

  // Handle graceful shutdown
  async function handleExit() {
    logger.info('Exiting. Wait for graceful shutdown.')

    // Close the express server
    await new Promise<void>((resolve) => {
      app.listen().close(() => {
        logger.info('Express server closed')
        resolve()
      })
    })

    process.exit(0)
  }

  // Listen for termination signals
  process.on('SIGINT', handleExit)
  process.on('SIGTERM', handleExit)
}

async function processEvent({ iface, logger }: { iface: Interface; logger: Logger }) {
  const _logger = logger.child({ name: 'adcs-processEvent', file: FILE_NAME })
  async function wrapper(log): Promise<ProcessEventOutputType | undefined> {
    const eventData = iface?.parseLog(log)?.args as unknown as IDataRequested
    _logger.debug(eventData, 'eventData')
    const requestId = eventData.requestId.toString()
    const jobData: IADCSListenerWorker = {
      callbackAddress: log.address,
      blockNum: Number(eventData.blockNumber),
      requestId,
      callbackGasLimit: Number(eventData.callbackGasLimit),
      sender: eventData.sender,
      jobId: eventData.jobId,
      data: eventData.data
    }
    _logger.debug(jobData, 'jobData')
    return { jobName: 'adcs-process-event', jobId: requestId, jobData }
  }

  return wrapper
}
export async function adcsStreamListener({
  chain,
  events,
  iface
}: {
  chain: string
  events: Log[]
  iface: Interface
}) {
  const processEventQueue = new Queue(LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME, BULLMQ_CONNECTION)
  for (const [index, event] of events.entries()) {
    const eventData = iface?.parseLog(event)
    if (!eventData) {
      continue
    }
    if (eventData.name !== 'DataRequested') {
      continue
    }
    const outData: IProcessEventListenerJobV2 = {
      chain,
      contractAddress: event.address,
      event
    }
    const jobId = getUniqueEventIdentifier(event, index)
    await processEventQueue.add('latest', outData, {
      jobId,
      ...LISTENER_JOB_SETTINGS
    })
    console.log(`Added job ${jobId} to queue ${LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME}`)
  }
}
