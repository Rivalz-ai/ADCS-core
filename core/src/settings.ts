import * as dotenv from 'dotenv'
import { JsonRpcProvider } from 'ethers'
dotenv.config()

export const CHAIN = process.env.CHAIN || 'localhost'
export const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME || 'rivalz'

export const DATA_FEED_FULFILL_GAS_MINIMUM = 400_000
export const REQUEST_RESPONSE_FULFILL_GAS_MINIMUM = 400_000
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

export const WORKER_DEVIATION_QUEUE_NAME = `rivalz-deviation-queue`

export const LISTENER_REQUEST_RESPONSE_HISTORY_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-request-response-history-queue`
export const LISTENER_REQUEST_RESPONSE_LATEST_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-request-response-latest-queue`
export const LISTENER_REQUEST_RESPONSE_PROCESS_EVENT_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-request-response-event-queue`
export const REQUEST_RESPONSE_LISTENER_STATE_NAME = `${DEPLOYMENT_NAME}-listener-request-response-state`
export const REQUEST_RESPONSE_SERVICE_NAME = 'REQUEST_RESPONSE'
export const WORKER_REQUEST_RESPONSE_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-request-response-queue`

//vrf
export const LISTENER_VRF_HISTORY_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-history-queue`
export const LISTENER_VRF_LATEST_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-latest-queue`
export const LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-event-queue`
export const VRF_LISTENER_STATE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-state`
export const VRF_SERVICE_NAME = `VRF`
export const WORKER_VRF_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-worker-queue`

export const NONCE_MANAGER_VRF_QUEUE_NAME = `${DEPLOYMENT_NAME}-nonce-manager-vrf-queue`

export const REMOVE_ON_COMPLETE = 500
export const REMOVE_ON_FAIL = 1_000
export const CONCURRENCY = 12
// Data Feed
export const MAX_DATA_STALENESS = 60_000

export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
export const LOG_DIR = process.env.LOG_DIR || './log'

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
export const PROVIDER_URL = process.env.PROVIDER_URL || 'http://127.0.0.1:8545'
export const API_URL = process.env.API_URL || 'http://localhost:3010'
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''

export const BULLMQ_CONNECTION = {
  concurrency: CONCURRENCY,
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT
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

export const ALL_QUEUES = []

function createJsonRpcProvider(providerUrl: string = PROVIDER_URL) {
  return new JsonRpcProvider(providerUrl)
}
export const PROVIDER = createJsonRpcProvider()

export function getObservedBlockRedisKey(contractAddress: string) {
  return `${contractAddress}-listener-${DEPLOYMENT_NAME}`
}
