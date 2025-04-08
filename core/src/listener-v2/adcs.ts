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
  LISTENER_JOB_SETTINGS
} from '../settings'
import { ADCS_ABI } from '../constants/adcs.coordinator.abi'
import { Queue } from 'bullmq'
import { getUniqueEventIdentifier } from './utils'

const FILE_NAME = import.meta.url

export async function buildListener(logger: Logger) {
  const processEventQueueName = LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME
  const workerQueueName = WORKER_ADCS_QUEUE_NAME
  const iface = new Interface(ADCS_ABI)

  listenerServiceV2({
    processEventQueueName,
    workerQueueName,
    processFn: await processEvent({ iface, logger }),
    logger
  })
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

export async function adcsStreamListener({ chain, events }: { chain: string; events: Log[] }) {
  const processEventQueue = new Queue(LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME, BULLMQ_CONNECTION)
  for (const [index, event] of events.entries()) {
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
  }
}
