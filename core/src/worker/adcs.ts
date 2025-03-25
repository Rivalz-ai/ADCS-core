import { Worker } from 'bullmq'
import { Interface, parseUnits, randomBytes, uuidV4 } from 'ethers'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import {
  BULLMQ_CONNECTION,
  CHAIN,
  PROVIDER_URL,
  ADCS_FULFILL_GAS_MINIMUM,
  ADCS_SERVICE_NAME,
  WORKER_ADCS_QUEUE_NAME
} from '../settings'
import { IADCSListenerWorker, IADCSTransactionParameters } from '../types'

import {
  add0GKey,
  fetchAdapterByJobId,
  fetchAiModelData,
  fetchMemeCoinData,
  fetchPriceByPairName
} from './api'
import { buildTransaction } from './adcs.utils'
import { ADCS_ABI as ADCSAbis } from '../constants/adcs.coordinator.abi'
import { getReporterByAddress } from '../apis'
import { buildWallet, sendTransaction } from './utils'
import { decodeRequest } from './decoding'
import { IFetchAiModelData } from './types'
import { ZeroG } from './og'

import * as crypto from 'crypto'

const FILE_NAME = import.meta.url
const DECIMALS = 6

export async function buildWorker(redisClient: RedisClientType, _logger: Logger, zeroG: ZeroG) {
  const logger = _logger.child({ name: 'worker', file: FILE_NAME })
  const worker = new Worker(WORKER_ADCS_QUEUE_NAME, await job(zeroG, _logger), BULLMQ_CONNECTION)

  async function handleExit() {
    logger.info('Exiting. Wait for graceful shutdown.')

    await redisClient.quit()
    await worker.close()
  }
  process.on('SIGINT', handleExit)
  process.on('SIGTERM', handleExit)
}

export async function job(zeroG: ZeroG, _logger: Logger) {
  const logger = _logger.child({ name: 'job', file: FILE_NAME })
  const iface = new Interface(ADCSAbis)

  async function wrapper(job) {
    const inData: IADCSListenerWorker = job.data
    console.log({ inData })
    logger.debug(inData, 'inData')
    // decode data
    const decodedData = await decodeRequest(inData.data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let formattedResponse: any
    try {
      const adapter = await fetchAdapterByJobId(inData.jobId, _logger)
      if (!adapter) {
        throw new Error('No adapter')
      }

      switch (Number(adapter.categoryId)) {
        case 5:
          // eslint-disable-next-line
          const pairName = `${decodedData[0].value}-${decodedData[1].value}`
          // eslint-disable-next-line
          const rawData = await fetchPriceByPairName({
            pairName,
            logger: _logger
          })
          if (!rawData) {
            throw new Error('No data')
          }
          console.log({ rawData })
          // eslint-disable-next-line
          const response = Object.values(Object.values(rawData)[0])[0]
          formattedResponse = parseUnits(Number(response).toFixed(DECIMALS), DECIMALS).toString()

          if (!response) {
            throw new Error('No response')
          }
          break
        case 6: // meme
          // eslint-disable-next-line
          const meme = await fetchMemeCoinData({ logger: _logger })
          formattedResponse = [meme.final_decision.token_name, meme.final_decision.decision]
          break
        case 7: {
          // ai model
          const data: IFetchAiModelData = {
            content: adapter.aiPrompt,
            dataTypeId: adapter.outputTypeId
          }
          formattedResponse = await fetchAiModelData({
            logger: _logger,
            url: adapter.provider.endpoint,
            data
          })
          if (formattedResponse.length === 0) {
            throw new Error('No response')
          }
          if (formattedResponse.length === 1) {
            formattedResponse = formattedResponse[0]
          }
          break
        }
      }
      if (!formattedResponse) {
        throw new Error('No response')
      }

      const payloadParameters: IADCSTransactionParameters = {
        blockNum: inData.blockNum,
        requestId: inData.requestId,
        callbackGasLimit: inData.callbackGasLimit,
        sender: inData.sender,
        response: formattedResponse,
        jobId: inData.jobId,
        fulfillDataRequestFn: adapter.fulfillDataRequestFn
      }
      const to = inData.callbackAddress

      const tx = buildTransaction(payloadParameters, to, ADCS_FULFILL_GAS_MINIMUM, iface, logger)
      logger.debug(tx, 'tx')
      console.log({ tx })
      //send transaction
      await sendTx(tx, logger, zeroG)

      return tx
    } catch (e) {
      logger.error(e)
      throw e
    }
  }

  return wrapper
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendTx(tx: any, logger: Logger, zeroG: ZeroG) {
  const reporter = await getReporterByAddress({
    service: ADCS_SERVICE_NAME,
    chain: CHAIN,
    oracleAddress: tx.to,
    logger
  })

  const wallet = buildWallet({ privateKey: reporter.privateKey, providerUrl: PROVIDER_URL })

  const txParams = {
    wallet,
    to: tx.to,
    payload: tx.payload,
    gasLimit: ADCS_FULFILL_GAS_MINIMUM,
    logger
  }
  await sendTransaction(txParams)

  // send to 0G
  try {
    const fileData = tx.rc.toString()
    const randomWords = crypto.randomUUID()
    await zeroG.uploadKvData(randomWords, fileData)
    await add0GKey(randomWords)
  } catch (error) {}
}
