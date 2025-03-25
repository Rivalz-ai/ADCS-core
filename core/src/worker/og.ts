import {
  ZgFile,
  Indexer,
  Batcher,
  KvClient,
  FixedPriceFlow__factory,
  FixedPriceFlow
} from '@0glabs/0g-ts-sdk'
import { ethers, getBytes, JsonRpcProvider, Wallet } from 'ethers'
import { D0G_PRIVATE_KEY, ZeroG_RPC_URL } from '../settings'
import { writeFileSync, unlinkSync } from 'fs'

export class ZeroG {
  indexer: Indexer
  flowContract: FixedPriceFlow
  signer: Wallet
  provider: JsonRpcProvider

  constructor() {
    // Network Constants
    const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai'
    // Initialize provider and signer
    // Make sure to use a private key with sufficient balance for transactions
    this.provider = new JsonRpcProvider(ZeroG_RPC_URL)
    this.signer = new Wallet(D0G_PRIVATE_KEY, this.provider)

    // Initialize indexer
    this.indexer = new Indexer(INDEXER_RPC)

    const FLOW_CONTRACT_ADDRESS = '0xbD2C3F0E65eDF5582141C35969d66e34629cC768' // Replace with actual address
    this.flowContract = FixedPriceFlow__factory.connect(FLOW_CONTRACT_ADDRESS, this.signer)
  }

  async uploadKvData(key: string, data: string) {
    try {
      // Select nodes
      const [nodes, err] = await this.indexer.selectNodes(1)
      if (err !== null) {
        console.log('Error selecting nodes: ', err)
        return
      }

      // Initialize batcher with flowContract
      const batcher = new Batcher(1, nodes, this.flowContract, ZeroG_RPC_URL)

      // Prepare KV data
      const key1 = Uint8Array.from(Buffer.from(key, 'utf-8'))
      const val1 = Uint8Array.from(Buffer.from(data, 'utf-8'))
      // Assuming "0x..." is a stream ID or placeholder address
      let streamId = ethers.keccak256(
        ethers.solidityPacked(['address', 'uint256'], [this.signer.address, Date.now()])
      )
      batcher.streamDataBuilder.set(streamId, key1, val1)
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

  async downloadKV(key: string) {
    const KvClientAddr = 'http://3.101.147.150:6789'
    const streamId = ethers.keccak256(
      ethers.solidityPacked(['address', 'uint256'], [this.signer.address, Date.now()])
    )
    const kvClient = new KvClient(KvClientAddr)
    const keyUintArray = Uint8Array.from(Buffer.from(key, 'utf-8'))
    const keyBytes = getBytes(keyUintArray)
    let val = await kvClient.getValue(streamId, keyBytes)
    console.log(val)
  }

  async uploadFile(fileName: string, data: string) {
    try {
      // Prepare a sample file (or use your own)
      writeFileSync(`${fileName}.txt`, data)

      // Create ZgFile object from file path
      const zgFile = await ZgFile.fromFilePath(`${fileName}.txt`)

      // Generate Merkle tree for verification
      const [tree, treeErr] = await zgFile.merkleTree()
      if (treeErr !== null) {
        throw new Error(`Error generating Merkle tree: ${treeErr}`)
      }

      // Get root hash for future reference
      console.log('File Root Hash:', tree?.rootHash() ?? '')
      console.log('zero g rpc', ZeroG_RPC_URL)
      try {
        const [tx, uploadErr] = await this.indexer.upload(zgFile, ZeroG_RPC_URL, this.signer)
        if (uploadErr !== null) {
          throw new Error(`Upload error: ${uploadErr}`)
        }
        console.log('Upload successful!')
        console.log('Transaction Hash:', tx)
        // Clean up
        unlinkSync(`${fileName}.txt`)
      } catch (error) {
        console.error('Upload error:', error instanceof Error ? error.message : error)
      }
    } catch (error) {
      console.error('Upload failed:', error.message)
    }
  }

  async downloadFile(rootHash: string) {
    try {
      const outputPath = 'testdownloaded.txt'
      // withProof = true enables Merkle proof verification
      const err = await this.indexer.download(rootHash, outputPath, true)
      if (err !== null) {
        throw new Error(`Download error: ${err}`)
      }
      console.log('Download successful!')
    } catch (error) {
      console.error('Download error:', error instanceof Error ? error.message : error)
    }
  }

  async uploadProof(fileName: string, proof: string) {
    try {
      // Prepare a sample file (or use your own)
      writeFileSync(`${fileName}.txt`, proof)
      // Create ZgFile object from file path
      const zgFileData = await ZgFile.fromFilePath(`${fileName}.txt`)
      // Generate Merkle tree for verification
      const [tree, treeErr] = await zgFileData.merkleTree()
      if (treeErr !== null) {
        throw new Error(`Error generating Merkle tree: ${treeErr}`)
      }
      const [tx, uploadErr] = await this.indexer.upload(zgFileData, ZeroG_RPC_URL, this.signer)
      if (uploadErr !== null) {
        throw new Error(`Upload error: ${uploadErr}`)
      }
      // Clean up
      unlinkSync(`${fileName}.txt`)
    } catch (error) {
      console.error('Upload failed:', error.message)
    }
  }
}
