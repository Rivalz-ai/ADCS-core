import { Interface, keccak256, solidityPacked } from 'ethers'
import { Logger } from 'pino'
import { RequestCommitmentADCS, ITransactionParameters, IADCSTransactionParameters } from '../types'
import { RivalzError, RivalzErrorCode } from '../errors'

export function buildTransaction(
  payloadParameters: IADCSTransactionParameters,
  to: string,
  gasMinimum: number,
  iface: Interface,
  logger: Logger
): ITransactionParameters {
  const gasLimit = payloadParameters.callbackGasLimit + gasMinimum
  console.log({ gasLimit })
  const fulfillDataRequestFn = payloadParameters.fulfillDataRequestFn
  if (fulfillDataRequestFn == undefined) {
    const msg = `Unknown requestId ${payloadParameters.requestId}`
    logger.error(msg)
    throw new RivalzError(RivalzErrorCode.UnknownRequestResponseJob, msg)
  }

  const response = payloadParameters.response

  const rc: RequestCommitmentADCS = [
    payloadParameters.blockNum,
    payloadParameters.callbackGasLimit,
    payloadParameters.sender,
    payloadParameters.jobId
  ]
  logger.debug(rc, 'rc')

  const payload = iface.encodeFunctionData(fulfillDataRequestFn, [
    payloadParameters.requestId,
    response,
    rc
  ])
  console.log({ rc, response, fulfillDataRequestFn, requestId: payloadParameters.requestId })
  const tx = {
    payload,
    gasLimit,
    to,
    rc,
    response
  }

  return tx
}
