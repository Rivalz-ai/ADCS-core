import {
  ZgFile,
  Indexer,
  Batcher,
  KvClient,
  FixedPriceFlow__factory,
  FixedPriceFlow
} from '@0glabs/0g-ts-sdk'
import { ethers, JsonRpcProvider, Wallet } from 'ethers'
import { D0G_PRIVATE_KEY, ZeroG_RPC_URL } from '../settings'
import { writeFileSync, unlinkSync } from 'fs'

export class ZeroG {
  indexer: Indexer
  flowContract: FixedPriceFlow
  signer: Wallet
  provider: JsonRpcProvider

  constructor() {
    try {
      const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai'
      this.provider = new JsonRpcProvider(ZeroG_RPC_URL)
      this.signer = new Wallet(D0G_PRIVATE_KEY, this.provider)
      this.indexer = new Indexer(INDEXER_RPC)

      const FLOW_CONTRACT_ADDRESS = '0xbD2C3F0E65eDF5582141C35969d66e34629cC768' // Replace with actual address
      this.flowContract = FixedPriceFlow__factory.connect(FLOW_CONTRACT_ADDRESS, this.signer)
    } catch (error) {
      console.error('Error initializing ZeroG:', error)
    }
  }

  async uploadKvData(key: string, data: string) {
    try {
      const [nodes, err] = await this.indexer.selectNodes(1)
      if (err !== null) {
        console.log('Error selecting nodes: ', err)
        return
      }

      const batcher = new Batcher(1, nodes, this.flowContract, ZeroG_RPC_URL)
      const key1 = Uint8Array.from(Buffer.from(key, 'utf-8'))
      const val1 = Uint8Array.from(Buffer.from(data, 'utf-8'))

      batcher.streamDataBuilder.set(key, key1, val1)
      const [tx, batchErr] = await batcher
        .exec
        //   {
        //   fee: 10000000000000n,
        //   tags: '0x',
        //   finalityRequired: true,
        //   taskSize: 1,
        //   expectedReplica: 1,
        //   skipTx: false
        // }
        ()
      if (batchErr === null) {
        console.log('Batcher executed successfully, tx: ', tx)
      } else {
        console.log('Error executing batcher: ', batchErr)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  async downloadKV(key: string) {
    try {
      console.log('start...')
      const KvClientAddr = 'http://3.101.147.150:6789'
      const streamId = ethers.keccak256(
        ethers.solidityPacked(['address', 'uint256'], [this.signer.address, Date.now()])
      )

      const kvClient = new KvClient(KvClientAddr)

      const keyUintArray = Uint8Array.from(Buffer.from(key, 'utf-8'))
      console.log('downloading...')
      let val = await kvClient.getValue(key, keyUintArray)
      console.log('data', val)
    } catch (error) {
      console.log(error)
    }
  }

  async uploadFile(fileName: string, data: string) {
    try {
      writeFileSync(`${fileName}.txt`, data)
      const zgFile = await ZgFile.fromFilePath(`${fileName}.txt`)
      const [tree, treeErr] = await zgFile.merkleTree()
      if (treeErr !== null) {
        throw new Error(`Error generating Merkle tree: ${treeErr}`)
      }
      try {
        const feeInfo = await this.provider.getFeeData()
        console.log({ feeInfo })
        const feeMutiplier = 5
        const gasPrice =
          BigInt(Number(feeInfo.gasPrice) * feeMutiplier) > BigInt(feeInfo.maxFeePerGas || 0)
            ? BigInt(feeInfo.maxFeePerGas || 0)
            : BigInt(Number(feeInfo.gasPrice) * feeMutiplier)
        const [tx, uploadErr] = await this.indexer.upload(
          zgFile,
          ZeroG_RPC_URL,
          this.signer,
          undefined,
          undefined,
          {
            //gasPrice: 10000000000000n
            //gasLimit: 30000000000000n
          }
        )
        if (uploadErr !== null) {
          throw new Error(`Upload error: ${uploadErr}`)
        }
        console.log('Upload successful!')
        console.log('Transaction Hash:', tx)
        console.log('Root Hash:', tree?.rootHash?.toString())
        // Clean up
        unlinkSync(`${fileName}.txt`)
        return tree?.rootHash()?.toString() || ''
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
      const err = await this.indexer.download(rootHash, outputPath, true)
      if (err !== null) {
        throw new Error(`Download error: ${err}`)
      }
      console.log('Download successful!')
    } catch (error) {
      console.error('Download error:', error instanceof Error ? error.message : error)
    }
  }
}

//const zeroG = new ZeroG()
//zeroG.uploadFile('0xc5360e38c99a6a0e6d2f6b4c58f7949f9a3c544e005de9f6a98a969c65f231b8', 'test1')
//zeroG.downloadFile('0x8429287d31e16ad36b9ed2cad30cae24b6de23c160ebbf9b30ab80eb4b5b0cb8')
