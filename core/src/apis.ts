import { Logger } from 'pino'
import { buildUrl } from './utils'
import { ADCS_API_URL, API_URL, CHAIN, DATA_FEED_SERVICE_NAME } from './settings'
import axios from 'axios'
import { RivalzError, RivalzErrorCode } from './errors'
import { IReporterConfig, IVrfConfig } from './types'
const FILE_NAME = import.meta.url

export async function aggregatorByName(feedName: string) {}

export async function getOperatorAddress({
  aggregatorAddress,
  logger
}: {
  aggregatorAddress: string
  logger: Logger
}) {
  logger.debug('getOperatorAddress')

  return await (
    await getReporterByAddress({
      service: DATA_FEED_SERVICE_NAME,
      chain: CHAIN,
      oracleAddress: aggregatorAddress,
      logger
    })
  ).address
}

/**
 * Fetch reporter from the API that are associated with
 * given `service` and `chain`.
 *
 * @param {string} service name
 * @param {string} chain name
 * @param {string} aggregator address
 * @param {pino.Logger} logger
 * @return {IReporterConfig} reporter configuration
 * @exception {GetReporterRequestFailed}
 */
export async function getReporterByAddress({
  service,
  chain,
  oracleAddress,
  logger
}: {
  service: string
  chain: string
  oracleAddress: string
  logger: Logger
}): Promise<IReporterConfig> {
  try {
    const endpoint = buildUrl(
      ADCS_API_URL,
      `reporters/by-chain-and-contract?chain=${chain}&contractAddress=${oracleAddress}`
    )
    console.log('endpoint', endpoint)
    const reporter = (await axios.get(endpoint))?.data

    if (reporter.length != 1) {
      logger.error(`Expected 1 reporter, received ${reporter.length}`)
      throw new Error()
    }

    return reporter[0]
  } catch (e) {
    logger.error({ name: 'getReportersByOracleAddress', file: FILE_NAME, ...e }, 'error')
    if (e.code === 'ECONNREFUSED') {
      throw new RivalzError(RivalzErrorCode.FailedToConnectAPI)
    } else {
      throw new RivalzError(RivalzErrorCode.GetReporterRequestFailed)
    }
  }
}

export async function getVrfConfig({
  chain,
  logger
}: {
  chain: string
  logger?: Logger
}): Promise<IVrfConfig> {
  try {
    const endpoint = buildUrl(API_URL, 'vrf')
    const vrfKeys = (await axios.get(endpoint, { data: { chain } }))?.data

    if (vrfKeys.length == 0) {
      throw new Error(`Found no VRF key for chain [${chain}]`)
    } else if (vrfKeys.length > 1) {
      throw new Error(`Found more than one VRF key for chain [${chain}]`)
    }

    return vrfKeys[0]
  } catch (e) {
    logger?.error({ name: 'getVrfConfig', file: FILE_NAME, ...e }, 'error')
    throw new RivalzError(RivalzErrorCode.GetVrfConfigRequestFailed)
  }
}
