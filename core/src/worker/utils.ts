import { Contract, ethers, JsonRpcProvider, NonceManager, parseUnits } from 'ethers'
import { PROVIDER_URL } from '../settings'
import { RivalzError, RivalzErrorCode } from '../errors'
import { Logger } from 'pino'
import { add0x } from '../utils'

const gasLimit = 787230
// const baseFee = parseUnits('0.3', 'gwei')
const maxPriority = parseUnits('0.001', 'gwei') // gwei
// const maxgas = maxPriority + baseFee //gwei
const FILE_NAME = import.meta.url

export function buildReducer(reducerMapping, reducers) {
  return reducers.map((r) => {
    const reducer = reducerMapping[r.function]
    if (!reducer) {
      throw new RivalzError(RivalzErrorCode.InvalidReducer)
    }
    return reducer(r?.args)
  })
}

export function uniform(a: number, b: number): number {
  if (a > b) {
    throw new RivalzError(RivalzErrorCode.UniformWrongParams)
  }
  return a + Math.round(Math.random() * (b - a))
}

export async function getTransaction(txHash: string) {
  const provider = new ethers.JsonRpcProvider(PROVIDER_URL)
  return await provider.getTransaction(txHash)
}

export function buildWallet({
  privateKey,
  providerUrl
}: {
  privateKey: string
  providerUrl: string
}) {
  const provider = new JsonRpcProvider(providerUrl)
  const basicWallet = new ethers.Wallet(privateKey, provider)
  const wallet = new NonceManager(basicWallet)
  return wallet
}

export async function sendTransaction({
  wallet,
  to,
  payload,
  gasLimit,
  value,
  logger
}: {
  wallet: any
  to: string
  payload?: string
  gasLimit?: number | string
  value?: number | string | bigint
  logger: Logger
}) {
  const _logger = logger.child({ name: 'sendTransaction', file: FILE_NAME })

  if (payload) {
    payload = add0x(payload)
  }

  const tx = {
    from: await wallet.getAddress(),
    to: to,
    data: payload || '0x00',
    value: value || '0x00'
  }
  if (gasLimit) {
    tx['gasLimit'] = gasLimit
  }
  _logger.debug(tx, 'tx')

  try {
    await wallet.call(tx)
    const txReceipt = await (await wallet.sendTransaction(tx)).wait(1)
    _logger.debug(txReceipt, 'txReceipt')
    if (txReceipt === null) {
      throw new RivalzError(RivalzErrorCode.TxNotMined)
    }
  } catch (e) {
    _logger.debug(e, 'e')

    let msg
    let error
    if (e.reason == 'invalid address') {
      msg = `TxInvalidAddress ${e.value}`
      error = new RivalzError(RivalzErrorCode.TxInvalidAddress, msg, e.value)
    } else if (e.reason == 'processing response error') {
      msg = `TxProcessingResponseError ${e.value}`
      error = new RivalzError(RivalzErrorCode.TxProcessingResponseError, msg, e.value)
    } else if (e.reason == 'missing response') {
      msg = 'TxMissingResponseError'
      error = new RivalzError(RivalzErrorCode.TxMissingResponseError, msg)
    } else if (e.reason == 'transaction failed') {
      msg = 'TxTransactionFailed'
      error = new RivalzError(RivalzErrorCode.TxTransactionFailed, msg)
    } else if (e.reason == 'insufficient funds for intrinsic transaction cost') {
      msg = 'TxInsufficientFunds'
      error = new RivalzError(RivalzErrorCode.TxProcessingResponseError, msg)
    } else if (e.code == 'UNPREDICTABLE_GAS_LIMIT') {
      msg = 'TxCannotEstimateGasError'
      error = new RivalzError(RivalzErrorCode.TxCannotEstimateGasError, msg, e.value)
    } else {
      error = e
    }

    _logger.error(msg)
    throw error
  }
}