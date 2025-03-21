import {
  ZgFile,
  Indexer,
  Batcher,
  KvClient,
  FixedPriceFlow__factory,
  FixedPriceFlow
} from '@0glabs/0g-ts-sdk'
import { encodeBase64, ethers, getBytes, JsonRpcProvider, Wallet } from 'ethers'
import { D0G_PRIVATE_KEY } from '../settings'
import { writeFileSync, unlinkSync } from 'fs'

// Network Constants
const RPC_URL = 'https://evmrpc-testnet.0g.ai'
const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai'

// Initialize provider and signer
// Make sure to use a private key with sufficient balance for transactions
const provider = new JsonRpcProvider(RPC_URL)
const signer = new Wallet(D0G_PRIVATE_KEY, provider)

// Initialize indexer
const indexer = new Indexer(INDEXER_RPC)

const FLOW_CONTRACT_ADDRESS = '0xbD2C3F0E65eDF5582141C35969d66e34629cC768' // Replace with actual address
const flowContract: FixedPriceFlow = FixedPriceFlow__factory.connect(FLOW_CONTRACT_ADDRESS, signer)

async function uploadKvData() {
  try {
    // Select nodes
    const [nodes, err] = await indexer.selectNodes(1)
    if (err !== null) {
      console.log('Error selecting nodes: ', err)
      return
    }

    // Initialize batcher with flowContract
    const batcher = new Batcher(1, nodes, flowContract, RPC_URL)

    // Prepare KV data
    const key1 = Uint8Array.from(Buffer.from('TESTKEY0', 'utf-8'))
    const val1 = Uint8Array.from(Buffer.from('TESTVALUE0', 'utf-8'))
    const key2 = Uint8Array.from(Buffer.from('TESTKEY1', 'utf-8'))
    const val2 = Uint8Array.from(Buffer.from('TESTVALUE1', 'utf-8'))

    // Assuming "0x..." is a stream ID or placeholder address
    let streamId = ethers.keccak256(
      ethers.solidityPacked(['address', 'uint256'], [signer.address, Date.now()])
    )
    batcher.streamDataBuilder.set(streamId, key1, val1)
    streamId = ethers.keccak256(
      ethers.solidityPacked(['address', 'uint256'], [signer.address, Date.now()])
    )
    batcher.streamDataBuilder.set(streamId, key2, val2)

    // Execute batch
    const [tx, batchErr] = await batcher.exec()
    if (batchErr === null) {
      console.log('Batcher executed successfully, tx: ', tx)
    } else {
      console.log('Error executing batcher: ', batchErr)
    }
  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

async function downloadKV(key: string) {
  const KvClientAddr = 'http://3.101.147.150:6789'
  const streamId = '0x...'
  const kvClient = new KvClient(KvClientAddr)
  const keyUintArray = Uint8Array.from(Buffer.from(key, 'utf-8'))
  const keyBytes = getBytes(keyUintArray)
  let val = await kvClient.getValue(streamId, keyBytes)
  console.log(val)
}

async function uploadData() {
  try {
    // Prepare a sample file (or use your own)
    const fileContent = 'Hello, 0G Storage 2!'
    writeFileSync('test.txt', fileContent)

    // Create ZgFile object from file path
    const zgFile = await ZgFile.fromFilePath('test.txt')

    // Generate Merkle tree for verification
    const [tree, treeErr] = await zgFile.merkleTree()
    if (treeErr !== null) {
      throw new Error(`Error generating Merkle tree: ${treeErr}`)
    }

    // Get root hash for future reference
    console.log('File Root Hash:', tree?.rootHash() ?? '')

    try {
      const [tx, uploadErr] = await indexer.upload(zgFile, RPC_URL, signer, undefined, undefined, {
        gasPrice: 100000000000n
      })
      if (uploadErr !== null) {
        throw new Error(`Upload error: ${uploadErr}`)
      }
      console.log('Upload successful!')
      console.log('Transaction Hash:', tx)
      // Clean up
      unlinkSync('test.txt')
    } catch (error) {
      console.error('Upload error:', error instanceof Error ? error.message : error)
    }
  } catch (error) {
    console.error('Upload failed:', error.message)
  }
}

async function downloadData(rootHash: string) {
  try {
    const outputPath = 'testdownloaded.txt'
    // withProof = true enables Merkle proof verification
    const err = await indexer.download(rootHash, outputPath, true)
    if (err !== null) {
      throw new Error(`Download error: ${err}`)
    }
    console.log('Download successful!')
  } catch (error) {
    console.error('Download error:', error instanceof Error ? error.message : error)
  }
}
// Upload KV data

//uploadData().catch((err) => console.error('Error uploading KV data:', err))

// download data
downloadData('0x8429287d31e16ad36b9ed2cad30cae24b6de23c160ebbf9b30ab80eb4b5b0cb8').catch((err) =>
  console.error('Error uploading KV data:', err)
)


