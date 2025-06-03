import { Interface, Log } from 'ethers'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import { listenerService } from './listener'
import { IListenerConfig, IDataRequested, IADCSListenerWorker } from '../types'
import { ProcessEventOutputType } from './types'
import {
  CHAIN,
  LISTENER_ADCS_HISTORY_QUEUE_NAME,
  LISTENER_ADCS_LATEST_QUEUE_NAME,
  LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME,
  ADCS_LISTENER_STATE_NAME,
  ADCS_SERVICE_NAME,
  WORKER_ADCS_QUEUE_NAME
} from '../settings'
import { ADCS_ABI } from '../constants/adcs.coordinator.abi'

const FILE_NAME = import.meta.url

export async function buildListener(
  config: IListenerConfig[],
  redisClient: RedisClientType,
  rpcUrl: string,
  logger: Logger
) {
  const stateName = ADCS_LISTENER_STATE_NAME
  const service = ADCS_SERVICE_NAME
  const chain = CHAIN
  const eventName = 'DataRequested'
  const latestQueueName = LISTENER_ADCS_LATEST_QUEUE_NAME
  const historyQueueName = LISTENER_ADCS_HISTORY_QUEUE_NAME
  const processEventQueueName = LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME
  const workerQueueName = WORKER_ADCS_QUEUE_NAME
  const iface = new Interface(ADCS_ABI)

  listenerService({
    config,
    abi: ADCS_ABI,
    stateName,
    service,
    chain,
    rpcUrl,
    eventName,
    latestQueueName,
    historyQueueName,
    processEventQueueName,
    workerQueueName,
    processFn: await processEvent({ iface, logger }),
    redisClient,
    listenerInitType: 'latest',
    logger
  })
}

async function processEvent({ iface, logger }: { iface: Interface; logger: Logger }) {
  const _logger = logger.child({ name: 'Request-Response processEvent', file: FILE_NAME })
  async function wrapper(log): Promise<ProcessEventOutputType | undefined> {
    const eventData = iface?.parseLog(log)?.args as unknown as IDataRequested
    _logger.debug(eventData, 'eventData')
    const requestId = eventData.requestId.toString()
    const jobData: IADCSListenerWorker = {
      callbackAddress: log.address.toLowerCase(),
      blockNum: Number(eventData.blockNumber),
      requestId,
      callbackGasLimit: Number(eventData.callbackGasLimit),
      sender: eventData.sender,
      jobId: eventData.jobId,
      data: eventData.data
    }
    _logger.debug(jobData, 'jobData')
    return { jobName: 'request-response', jobId: requestId, jobData }
  }

  return wrapper
}
