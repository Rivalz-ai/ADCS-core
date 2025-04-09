import { Job, Worker, Queue } from 'bullmq'
import { Log } from 'ethers'
import { Logger } from 'pino'
import { BULLMQ_CONNECTION, LISTENER_JOB_SETTINGS } from '../settings'
import { IProcessEventListenerJobV2, ProcessEventOutputType } from './types'

const FILE_NAME = import.meta.url

/**
 * The listener service is used for tracking events emmitted by smart
 * contracts. Tracked events are subsequently send to BullMQ queue to
 * be processed by follow-up service. The listener service guarantees
 * that no event is missed.
 *
 * The listener service can be controlled through changes to its
 * ephemeral state. It keeps information about currently tracked
 * events, and allows to activate/deactivate events while the listener
 * service is running. The listener's ephemeral state is updated
 * through Watchman REST API service.
 *
 * @param {string} processEventQueueName name of [processEvent] queue
 * @param {string} workerQueueName name of [worker] queue
 * @param {(log: ethers.Event) => Promise<ProcessEventOutputType>} event processing function
 * @param {Logger} pino logger
 */
export async function listenerServiceV2({
  processEventQueueName,
  workerQueueName,
  processFn,
  logger
}: {
  processEventQueueName: string
  workerQueueName: string
  processFn: (log: Log) => Promise<ProcessEventOutputType | undefined>
  logger: Logger
}) {
  const workerQueue = new Queue(workerQueueName, BULLMQ_CONNECTION)

  const processEventWorker = new Worker(
    processEventQueueName,
    processEventJob({ workerQueue, processFn, logger }),
    BULLMQ_CONNECTION
  )
  processEventWorker.on('error', (e) => {
    logger.error(e)
  })

  async function handleExit() {
    logger.info('Exiting. Wait for graceful shutdown.')

    await processEventWorker.close()
  }
  process.on('SIGINT', handleExit)
  process.on('SIGTERM', handleExit)
}

/**
 * The [processEvent] listener worker accepts jobs from [processEvent]
 * queue. The jobs are submitted either by the [latest] or [history]
 * listener worker.
 *
 * @param {(log: ethers.Event) => Promise<ProcessEventOutputType | undefined>} function that processes event caught by listener
 */
function processEventJob({
  workerQueue,
  processFn,
  logger
}: {
  workerQueue: Queue
  processFn: (log: Log) => Promise<ProcessEventOutputType | undefined>
  logger: Logger
}) {
  const _logger = logger.child({ name: 'processEventJob', file: FILE_NAME })

  async function wrapper(job: Job) {
    const inData: IProcessEventListenerJobV2 = job.data
    const { event, chain } = inData
    _logger.debug(event, 'event')

    try {
      const jobMetadata = await processFn(event)
      if (jobMetadata) {
        const { jobId, jobName, jobData, jobQueueSettings } = jobMetadata
        const queueSettings = jobQueueSettings ? jobQueueSettings : LISTENER_JOB_SETTINGS
        await workerQueue.add(
          jobName,
          { ...jobData, chain },
          {
            jobId,
            ...queueSettings
          }
        )
        _logger.debug(`Listener submitted job [${jobId}] for [${jobName}]`)
        console.log(`Listener submitted job [${jobId}] for [${jobName}]`)
      }
    } catch (e) {
      _logger.error(e, 'Error in user defined listener processing function')
      throw e
    }
  }

  return wrapper
}

/**
 * Auxiliary function to create a unique identifier for a give `event`
 * and `index` of the even within the transaction.
 *
 * @param {ethers.Log} event
 * @param {number} index of event within a transaction
 */
function getUniqueEventIdentifier(event: Log, index: number) {
  return `${event.blockNumber}-${event.transactionHash}-${index}`
}

/**
 * Auxiliary function that generate a consisten log prefix, that is
 * used both by the [latest] and [history] listener worker.
 *
 * @param {string} contractAddress
 * @param {number} start block number
 * @param {number} end block number
 */
function generateListenerLogPrefix(contractAddress: string, fromBlock: number, toBlock: number) {
  return `${contractAddress} ${fromBlock}-${toBlock} (${toBlock - fromBlock})`
}
