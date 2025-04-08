import axios from 'axios'
import { Logger } from 'pino'
import { IListenerRawConfig } from '../types'
import { ADCS_API_URL } from '../settings'
import { buildUrl } from '../utils'
import { RivalzError, RivalzErrorCode } from '../errors'

const FILE_NAME = import.meta.url

/**
 * Fetch listeners from the Orakl Network API that are associated with
 * given `service` and `chain`.
 *
 * @param {string} service name
 * @param {string} chain name
 * @param {pino.Logger} logger
 * @return {Promise<IListenerRawConfig[]>} raw listener configuration
 * @exception {GetListenerRequestFailed}
 */
export async function getListeners({
  service,
  chain,
  logger
}: {
  service?: string
  chain?: string
  logger?: Logger
}): Promise<IListenerRawConfig[]> {
  try {
    const endpoint = buildUrl(
      ADCS_API_URL,
      `listeners/by-chain-and-service?service=${service}&chain=${chain}`
    )
    const data = (await axios.get(endpoint))?.data
    console.log(data)
    return data.map((item) => ({
      address: item.address,
      eventName: item.eventName,
      service: item.service.name,
      chain: item.chain.name
    }))
  } catch (e) {
    logger?.error({ name: 'getListeners', file: FILE_NAME, ...e }, 'error')
    throw new RivalzError(RivalzErrorCode.GetListenerRequestFailed)
  }
}

/**
 * Fetch single listener given its ID from the Orakl Network API.
 *
 * @param {string} listener ID
 * @param {pino.Logger} logger
 * @return {Promise<IListenerRawConfig>} raw listener configuration
 * @exception {GetListenerRequestFailed}
 */
export async function getListener({
  id,
  logger
}: {
  id: string
  logger?: Logger
}): Promise<IListenerRawConfig> {
  try {
    const endpoint = buildUrl(ADCS_API_URL, `listener/${id}`)
    return (await axios.get(endpoint))?.data
  } catch (e) {
    logger?.error({ name: 'getListener', file: FILE_NAME, ...e }, 'error')
    throw new RivalzError(RivalzErrorCode.GetListenerRequestFailed)
  }
}
