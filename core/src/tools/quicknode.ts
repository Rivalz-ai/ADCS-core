import axios from 'axios'
import { QUICKNODE_API_KEY, WEBHOOK_KEY } from '../settings'
import { QuickNodeChain } from './type'

const axiosInstance = axios.create({
  baseURL: 'https://api.quicknode.com/',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': QUICKNODE_API_KEY
  }
})

function getQuickNodeChain(chain: string) {
  switch (chain) {
    case 'Ethereum':
      return QuickNodeChain.ETHEREUM_MAINNET
    case 'Arbitrum':
      return QuickNodeChain.ARBITRUM_MAINNET
    case 'Base':
      return QuickNodeChain.BASE_MAINNET
    case 'Blast':
      return QuickNodeChain.BLAST_MAINNET
    case 'Bsc':
      return QuickNodeChain.BNB_MAINNET
    case 'Bitcoin':
      return QuickNodeChain.BITCOIN_MAINNET
    case 'Cel':
      return QuickNodeChain.CELO_MAINNET
    case 'OP':
      return QuickNodeChain.OPTIMISM_MAINNET
    case 'Polygon':
      return QuickNodeChain.POLYGON_MAINNET
    case 'Solana':
      return QuickNodeChain.SOLANA_MAINNET
    case 'Tron':
      return QuickNodeChain.TRON_MAINNET
    case 'Berachain':
      return QuickNodeChain.BERA_MAINNET
    case 'Avalanche':
      return QuickNodeChain.AVALANCHE_MAINNET
    case 'Monad-testnet':
      return QuickNodeChain.MONAD_TESTNET
    case 'Sei':
      return QuickNodeChain.SEI
    case 'Mantle':
      return QuickNodeChain.MANTLE_MAINNET
    default:
      return chain
  }
}

export async function createCoordinatorStream(
  chain: string,
  coordinatorAddress: string,
  eventTopic: string,
  startBlock: number,
  webhookUrl: string
) {
  const qnChain = getQuickNodeChain(chain)
  const filterFunction = `
    function main(stream) {
        const ADCS_COORDINATOR_ADDRESS = '${coordinatorAddress}'.toLowerCase()

        const data = stream.data
        console.log('data', { data: data })
        let result = null
        try {
            result = data[0]
            console.log(result)
        } catch (ex) {
            console.log(ex)
        }
        if (result) {
            result = result
            .flat()
            .filter(
                (log) =>
                log.address?.toLowerCase() === ADCS_COORDINATOR_ADDRESS &&
                log.topics[0] === '${eventTopic}'
            )
        }
        return { chain: '${chain}', events: result }
    }
  `
  const data = {
    name: `${chain}-adcs-coordinator`,
    network: qnChain,
    dataset: 'logs',
    filter_function: Buffer.from(filterFunction).toString('base64'),
    region: 'usa_east',
    start_range: startBlock,
    dataset_batch_size: 1,
    include_stream_metadata: 'header',
    destination: 'webhook',
    fix_block_reorgs: 0,
    keep_distance_from_tip: 0,
    elastic_batch_enabled: false,
    destination_attributes: {
      url: webhookUrl,
      compression: 'none',
      headers: {
        'Content-Type': 'application/json',
        'rivalz-key': WEBHOOK_KEY
      },
      max_retry: 3,
      retry_interval_sec: 1,
      post_timeout_sec: 10
    },
    status: 'active'
  }
  const response = await axiosInstance.post('/streams/rest/v1/streams', data)
  return response.data
}

export async function getQuickNodeStream() {
  const response = await axiosInstance.get(`/streams/rest/v1/streams`)
  return response.data
}

export async function deleteQuickNodeStream(streamId: string) {
  const response = await axiosInstance.delete(`/streams/rest/v1/streams/${streamId}`)
  return response.data
}

export async function updateQuickNodeStartBlock(streamId: string, startBlock: number) {
  const data = {
    start_range: startBlock,
    status: 'active'
  }

  const response = await axiosInstance.patch(`/streams/rest/v1/streams/${streamId}`, data)
  return response.data
}

export async function activateQuickNodeStream(streamId: string) {
  const response = await axiosInstance.patch(`/streams/rest/v1/streams/${streamId}/activate`)
  return response.data
}

export async function pauseQuickNodeStream(streamId: string) {
  const response = await axiosInstance.patch(`/streams/rest/v1/streams/${streamId}/pause`)
  return response.data
}
