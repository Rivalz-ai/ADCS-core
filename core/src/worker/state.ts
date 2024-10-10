import { Queue } from 'bullmq'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import { getAggregators } from './api'
import { IAggregatorConfig } from './types'
import { RivalzError, RivalzErrorCode } from '../errors'

const FILE_NAME = import.meta.url

export class State {
  redisClient: RedisClientType
  stateName: string
  heartbeatQueue: Queue
  submitHeartbeatQueue: Queue
  chain: string
  logger: Logger
  wallets

  constructor({
    redisClient,
    stateName,
    heartbeatQueue,
    submitHeartbeatQueue,
    chain,
    logger
  }: {
    redisClient: RedisClientType
    stateName: string
    heartbeatQueue: Queue
    submitHeartbeatQueue: Queue
    chain: string
    logger: Logger
  }) {
    this.redisClient = redisClient
    this.stateName = stateName
    this.heartbeatQueue = heartbeatQueue
    this.submitHeartbeatQueue = submitHeartbeatQueue
    this.chain = chain
    this.logger = logger.child({ name: 'State', file: FILE_NAME })
    this.logger.debug('Aggregator state initialized')
  }

  /**
   * Clear aggregator state.
   */
  async clear() {
    this.logger.debug('clear')

    // Clear aggregator ephemeral state
    await this.redisClient.set(this.stateName, JSON.stringify([]))

    // Remove previously launched heartbeat jobs
    const delayedJobs = await this.heartbeatQueue.getJobs(['delayed'])
    for (const job of delayedJobs) {
      await job.remove()
    }

    this.logger.debug('Aggregator state cleared')
  }

  /**
   * List all aggregators given `chain`. The aggregator can
   * be either active or inactive.
   */
  async all() {
    this.logger.debug('all')
    return await getAggregators({ chain: this.chain, logger: this.logger })
  }

  /**
   * List all aggregators in an active state.
   */
  async active(): Promise<IAggregatorConfig[]> {
    this.logger.debug('active')
    const state = await this.redisClient.get(this.stateName)
    return state ? JSON.parse(state) : []
  }

  /**
   * Check whether given `oracleAddress` is active in local state or
   * not.
   *
   * @param {string} oracleAddress
   */
  async isActive({ oracleAddress }: { oracleAddress: string }) {
    this.logger.debug('isActive')
    const activeAggregators = await this.active()
    const isAlreadyActive = activeAggregators.filter((L) => L.address === oracleAddress) || []

    if (isAlreadyActive.length > 0) {
      return true
    } else {
      return false
    }
  }

  /**
   * Remove aggregator given `aggregatorHash`. Aggregator can be removed only if
   * it was in an active state.
   *
   * @param {string} aggregator hash
   * @exception {RivalzErrorCode.AggregatorNotRemoved} raise when no reporter was removed
   */
  async remove(aggregatorHash: string) {
    this.logger.debug('remove')

    const activeAggregators = await this.active()
    const numActiveAggregators = activeAggregators.length

    const index = activeAggregators.findIndex((L) => L.aggregatorHash == aggregatorHash)
    if (index === -1) {
      const msg = `Aggregator with aggregatorHash=${aggregatorHash} was not found.`
      this.logger.debug({ name: 'remove', file: FILE_NAME }, msg)
      throw new RivalzError(RivalzErrorCode.AggregatorNotFoundInState, msg)
    }

    const removedAggregator = activeAggregators.splice(index, 1)[0]

    const numUpdatedActiveAggregators = activeAggregators.length
    if (numActiveAggregators == numUpdatedActiveAggregators) {
      const msg = `Aggregator with aggregatorHash=${aggregatorHash} was not removed. Aggregator was not found.`
      this.logger.debug({ name: 'remove', file: FILE_NAME }, msg)
      throw new RivalzError(RivalzErrorCode.AggregatorNotRemoved, msg)
    }

    // Update active aggregators
    await this.redisClient.set(this.stateName, JSON.stringify(activeAggregators))

    return removedAggregator
  }

  /**
   * Update active aggregator denoted by `oracleAddress` with the
   * current `timestamp`.
   *
   * @param {string} oracle address
   * @return {IAggregatorConfig} update aggregator config
   */
  async updateTimestamp(oracleAddress: string) {
    this.logger.debug('updateTimestamp')

    const activeAggregators = await this.active()
    const index = activeAggregators.findIndex((L) => L.address == oracleAddress)
    if (index == -1) {
      throw new RivalzError(RivalzErrorCode.AggregatorNotFoundInState)
    }
    const timestamp = Date.now()
    const updatedAggregator: IAggregatorConfig = {
      ...activeAggregators.splice(index, 1)[0],
      timestamp
    }

    // Update active aggregators
    await this.redisClient.set(
      this.stateName,
      JSON.stringify([...activeAggregators, updatedAggregator])
    )

    return updatedAggregator
  }
}
