import { Queue } from 'bullmq'

interface IOraklRequest {
  id: string
  callbackAddr: string
  callbackFunc: string
  nonce: number
  buf: Buffer
}

export interface RequestEventData {
  specId: string
  requester: string
  payment: bigint
}

export interface IListeners {
  VRF: string[]
  AGGREGATORS: string[]
  REQUEST_RESPONSE: string[]
}

export interface ILog {
  address: string
  blockHash: string
  blockNumber: string
  data: string
  logIndex: string
  removed: boolean
  topics: string[]
  transactionHash: string
  transactionIndex: string
}

export interface IRequestOperation {
  name: string
  value: string
}

export interface ILatestRoundData {
  roundId: bigint
  answer: bigint
  startedAt: bigint
  updatedAt: bigint
  answeredInRound: bigint
}

export interface IOracleRoundState {
  eligibleToSubmit: boolean
  roundId: number
  latestSubmission: bigint
  startedAt: bigint
  timeout: bigint
  availableFunds: bigint
  oracleCount: number
  paymentAmount: bigint
}

export interface IRoundData {
  roundId: bigint
  answer: bigint
  startedAt: bigint
  updatedAt: bigint
  answeredInRound: bigint
}

// Events

export interface IDataRequested {
  requestId: bigint
  callbackGasLimit: bigint
  sender: string
  jobId: string
  blockNumber: bigint
  data: string
}

export interface IRandomWordsRequested {
  keyHash: string
  requestId: bigint
  preSeed: number
  callbackGasLimit: number
  numWords: number
  sender: string
  isDirectPayment: boolean
  blockNumber: bigint
}

export interface IRandomWordsFulfilled {
  requestId: bigint
  l2RequestId: bigint
  randomWords: bigint[]
  sender: string
  callbackGasLimit: number
}

export interface INewRound {
  roundId: bigint
  startedBy: string
  startedAt: bigint
}

export interface IAnswerUpdated {
  current: bigint
  roundId: bigint
  updatedAt: bigint
}

// Listener -> Worker

export interface IADCSListenerWorker {
  callbackAddress: string
  blockNum: number
  requestId: string
  callbackGasLimit: number
  sender: string
  jobId: string
  data: string
  chain?: string
}

export interface IVrfListenerWorker {
  callbackAddress: string
  blockNum: string
  blockHash: string
  requestId: string
  seed: string
  callbackGasLimit: number
  numWords: number
  sender: string
  isDirectPayment: boolean
}

export interface IDataFeedListenerWorker {
  oracleAddress: string
  roundId: number
  workerSource: string
}

// Worker -> Worker

export interface IAggregatorHeartbeatWorker {
  oracleAddress: string
}

export interface IAggregatorSubmitHeartbeatWorker {
  oracleAddress: string
  delay: number
}

// Worker -> Reporter

export interface IADCSWorkerReporter {
  callbackAddress: string
  blockNum: number
  requestId: string
  jobId: string
  accId: string
  callbackGasLimit: number
  sender: string
  isDirectPayment: boolean
  data: string | number
}

export interface IVrfWorkerReporter {
  callbackAddress: string
  blockNum: string
  requestId: string
  seed: string
  accId: string
  callbackGasLimit: number
  numWords: number
  sender: string
  isDirectPayment: boolean
  pk: [string, string]
  proof: [string, string, string, string]
  preSeed: string
  uPoint: [string, string]
  vComponents: [string, string, string, string]
}

// VRF
export type Proof = [
  [string, string] /* pk */,
  [string, string, string, string] /* proof */,
  string /* preSeed */,
  [string, string] /* uPoint */,
  [string, string, string, string] /* vComponents */
]

export type RequestCommitmentVRF = [
  string /* blockNum */,
  // string /* accId */,
  number /* callbackGasLimit */,
  number /* numWords */,
  string /* sender */
]

export type RequestCommitmentADCS = [
  number /* blockNum */,
  number /* callbackGasLimit */,
  string /* sender */,
  string /* pairName */
]

export interface IVrfConfig {
  sk: string
  pk: string
  pkX: string
  pkY: string
  keyHash: string
}

// Listener
export interface IListenerRawConfig {
  address: string
  eventName: string
  service: string
  chain?: string
  rpcUrl?: string
}

export interface IListenerConfig {
  id: string
  address: string
  eventName: string
  chain: string
  rpcUrl: string
}

export interface IListenerGroupConfig {
  [key: string]: IListenerConfig[]
}

export interface IChainRpc {
  id: string
  rpcUrl: string
}

// Reporter
export interface IReporterConfig {
  id: string
  address: string
  privateKey: string
  oracleAddress: string
  chain: string
  service: string
  fulfillMinimumGas: number
  chainRpcs: IChainRpc[]
}

// Data Feed
interface IHeader {
  'Content-Type': string
}

interface IReducer {
  function: string
  args: string[]
}

export interface IFeedDefinition {
  url: string
  method: string
  headers: IHeader[]
  reducers: IReducer[]
}

export interface IFeed {
  id: bigint
  adapterId: bigint
  name: string
  definition: IFeedDefinition
}

export interface IAdapter {
  id: number
  jobId: string
  name: string
  description: string
  categoryId: string
  outputTypeName: string
  outputTypeId: number
  coordinatorAddress: string
  fulfillDataRequestFn: string
  aiPrompt: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
}

export interface IAggregator {
  id: bigint
  aggregatorHash: string
  active: boolean
  name: string
  address: string
  heartbeat: number
  threshold: number
  absoluteThreshold: number
  adapterId: bigint
  chainId: bigint
  adapter?: IAdapter
}

export interface IAggregate {
  id: bigint
  timestamp: string
  value: bigint
  aggregatorId: bigint
}

export interface IAggregateById {
  timestamp: string
  value: bigint
}

export interface ITransactionParameters {
  payload: string
  gasLimit: number | string
  to: string
}

export interface IVrfTransactionParameters {
  blockNum: string
  seed: string
  callbackGasLimit: number
  numWords: number
  sender: string
  isDirectPayment: boolean
  pk: [string, string]
  proof: [string, string, string, string]
  preSeed: string
  uPoint: [string, string]
  vComponents: [string, string, string, string]
}

export interface IADCSTransactionParameters {
  blockNum: number
  requestId: string
  callbackGasLimit: number
  sender: string
  jobId: string
  response: any // eslint-disable-line @typescript-eslint/no-explicit-any
  fulfillDataRequestFn: string
}

export interface IDataFeedTransactionParameters {
  roundId: number
  submission: bigint
}

export interface MockQueue {
  add: any // eslint-disable-line @typescript-eslint/no-explicit-any
  process: any // eslint-disable-line @typescript-eslint/no-explicit-any
  on: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type QueueType = Queue | MockQueue

// Delegated Fee
export interface ITransactionData {
  from: string
  to: string
  input: string
  gas: string
  value: string
  chainId: string
  gasPrice: string
  nonce: string
  v: string
  r: string
  s: string
  rawTx: string
}

export interface IErrorMsgData {
  requestId: string
  timestamp: Date | string
  code: string
  name: string
  stack: string
}

export interface IMemeData {
  market_research: string
  memecoins_data: any // eslint-disable-line @typescript-eslint/no-explicit-any
  final_decision: {
    token_name: string
    decision: boolean
  }
}
