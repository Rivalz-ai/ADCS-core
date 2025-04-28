import * as dotenv from 'dotenv'
import { JsonRpcProvider } from 'ethers'
dotenv.config()

export const CHAIN = process.env.CHAIN || 'localhost'
export const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME || 'rivalz'

export const DATA_FEED_FULFILL_GAS_MINIMUM = 400_000
export const VRF_FULLFILL_GAS_PER_WORD = 1_000
export const VRF_FULFILL_GAS_MINIMUM = 1_000_000

export const WORKER_PORT = process.env.WORKER_PORT || 3011
export const LISTENER_PORT = process.env.LISTENER_PORT || 3012

export const LISTENER_DELAY = Number(process.env.LISTENER_DELAY) || 1500

export const LISTENER_DATA_FEED_LATEST_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-data-feed-latest-queue`
export const LISTENER_DATA_FEED_PROCESS_EVENT_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-data-feed-process-event-queue`
export const WORKER_DATA_FEED_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-data-feed-queue`
export const DATA_FEED_SERVICE_NAME = 'DATA_FEED'
export const REPORTER_AGGREGATOR_QUEUE_NAME = `${DEPLOYMENT_NAME}-reporter-aggregator-queue`

export const DATA_FEED_LISTENER_STATE_NAME = `${DEPLOYMENT_NAME}-listener-data-feed-state`
export const DATA_FEED_WORKER_STATE_NAME = `${DEPLOYMENT_NAME}-worker-data-feed-state`

export const HEARTBEAT_JOB_NAME = `${DEPLOYMENT_NAME}-heartbeat-job`
export const HEARTBEAT_QUEUE_NAME = `${DEPLOYMENT_NAME}-heartbeat-queue`
export const SUBMIT_HEARTBEAT_QUEUE_NAME = `${DEPLOYMENT_NAME}-submitheartbeat-queue`

export const WORKER_AGGREGATOR_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-aggregator-queue`
export const WORKER_CHECK_HEARTBEAT_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-checkheartbeat-queue`

export const WORKER_DEVIATION_QUEUE_NAME = `${DEPLOYMENT_NAME}-deviation-queue`

export const LISTENER_ADCS_HISTORY_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-adcs-history-queue`
export const LISTENER_ADCS_LATEST_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-adcs-latest-queue`
export const LISTENER_ADCS_PROCESS_EVENT_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-adcs-process-event-queue`
export const ADCS_LISTENER_STATE_NAME = `${DEPLOYMENT_NAME}-adcs-listener-state`
export const ADCS_SERVICE_NAME = 'ADCS'
export const WORKER_ADCS_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-adcs-queue`
export const WORKER_AUTOMATE_ADCS_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-automate-adcs-queue`

export const REMOVE_ON_COMPLETE = 500
export const REMOVE_ON_FAIL = 1_000
export const CONCURRENCY = 12
// Data Feed
export const MAX_DATA_STALENESS = 60_000

export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
export const LOG_DIR = process.env.LOG_DIR || './log'

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379

export const REDIS_USERNAME = process.env.REDIS_USERNAME || ''
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''

export const PROVIDER_URL = process.env.PROVIDER_URL || 'http://127.0.0.1:8545'
export const API_URL = process.env.API_URL || 'http://localhost:3010'
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''
export const ADCS_API_URL = process.env.ADCS_API_URL || 'http://localhost:3012'
export const INTFERENCE_API_URL = process.env.INTFERENCE_API_URL || 'http://localhost:3013'

export const D0G_PRIVATE_KEY = process.env.D0G_PRIVATE_KEY || ''
export const ZeroG_RPC_URL = process.env.ZeroG_RPC_URL || ''

export const LISTENER_V2_PORT = process.env.LISTENER_V2_PORT || '3000'
export const QUICKNODE_API_KEY = process.env.QUICKNODE_API_KEY || ''
export const WEBHOOK_KEY = process.env.WEBHOOK_KEY || ''

export const BULLMQ_CONNECTION = {
  concurrency: CONCURRENCY,
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: 'default',
    password: REDIS_PASSWORD
  }
}

export const LISTENER_JOB_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000
}

export const WORKER_JOB_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000
}

export const AGGREGATOR_QUEUE_SETTINGS = {
  // When [aggregator] worker fails, we want to be able to
  // resubmit the job with the same job ID.
  removeOnFail: true,
  attempts: 10,
  backoff: 1_000
}

export const SUBMIT_HEARTBEAT_QUEUE_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000
}

export const CHECK_HEARTBEAT_QUEUE_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000,
  repeat: {
    every: 30 * 60 * 1000 //30'
  }
}

export const HEARTBEAT_QUEUE_SETTINGS = {
  removeOnComplete: true,
  attempts: 10,
  backoff: 1_000
}

export const ALL_QUEUES = [
  `${DEPLOYMENT_NAME}-worker-data-feed-queue`,
  `${DEPLOYMENT_NAME}-worker-adcs-queue`,
  `${DEPLOYMENT_NAME}-worker-automate-adcs-queue`,
  `${DEPLOYMENT_NAME}-worker-deviation-queue`,
  `${DEPLOYMENT_NAME}-worker-aggregator-queue`,
  `${DEPLOYMENT_NAME}-worker-checkheartbeat-queue`,
  `${DEPLOYMENT_NAME}-heartbeat-queue`,
  `${DEPLOYMENT_NAME}-submitheartbeat-queue`,
  `${DEPLOYMENT_NAME}-listener-data-feed-latest-queue`,
  `${DEPLOYMENT_NAME}-listener-data-feed-process-event-queue`,
  `${DEPLOYMENT_NAME}-listener-adcs-history-queue`,
  `${DEPLOYMENT_NAME}-listener-adcs-latest-queue`,
  `${DEPLOYMENT_NAME}-listener-adcs-process-event-queue`
]

function createJsonRpcProvider(providerUrl: string = PROVIDER_URL) {
  return new JsonRpcProvider(providerUrl)
}
export const PROVIDER = createJsonRpcProvider()

export function getObservedBlockRedisKey(contractAddress: string) {
  return `${contractAddress}-listener-${DEPLOYMENT_NAME}`
}

console.log(process.env.REDIS_HOST)
console.log(process.env.REDIS_USERNAME)
console.log(process.env.REDIS_PORT)
console.log(process.env.PROVIDER_URL)
console.log(process.env.API_URL)
console.log(process.env.ADCS_API_URL)
console.log(process.env.CHAIN)
console.log(process.env.LOG_DIR)
