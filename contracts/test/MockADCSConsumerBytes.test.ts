import { expect, use } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { DataEncoder } from './helpers/dataEncoder'

describe('MockADCSConsumer', function () {
  async function deployMockADCSConsumerFixture() {
    const [owner, addr1] = await ethers.getSigners()

    // Deploy ADCS Coordinator
    const MockCoordinator = await ethers.getContractFactory('ADCSCoordinator')
    const coordinator = await MockCoordinator.deploy()

    // Deploy MockADCSConsumer
    const MockADCSConsumer = await ethers.getContractFactory('MockADCSConsumerArray')
    const mockADCSConsumer = await MockADCSConsumer.deploy(await coordinator.getAddress())
    await coordinator.setConfig(2500000, 900000)
    await coordinator.registerOracle(await owner.getAddress())

    return { mockADCSConsumer, coordinator, owner, addr1 }
  }

  describe('requestData', function () {
    it('should emit DataRequested event', async function () {
      const { mockADCSConsumer } = await loadFixture(deployMockADCSConsumerFixture)

      const jobId = ethers.encodeBytes32String('testJobId')
      const callbackGasLimit = 2500000

      await expect(mockADCSConsumer.requestArrayData(jobId, callbackGasLimit, 'BTC')).to.emit(
        mockADCSConsumer,
        'DataRequested'
      )
    })

    it('should fulfill Bytes request and update lastBytes', async function () {
      const { mockADCSConsumer, coordinator, owner } = await loadFixture(
        deployMockADCSConsumerFixture
      )

      const jobId = ethers.encodeBytes32String('testJobId')
      const callbackGasLimit = 2500000

      // Simulate oracle response
      const symbol = 'BTC'
      const signal = true

      // Encode data in TypeScript
      const encodedData = DataEncoder.encodeCoinData(symbol, signal)

      // Request data first to get the requestId
      const tx: any = await mockADCSConsumer.requestArrayData(jobId, callbackGasLimit, 'BTC')
      const receipt = await tx.wait()
      const requestId = receipt.logs[1].args[0]
      // Parse the event log from log index 0 for the coordinator contract
      const coordinatorInterface: any = coordinator.interface
      const coordinatorLog = coordinatorInterface.parseLog(receipt.logs[0])
      const {
        requestId: eRequestId,
        callbackGasLimit: eCallbackGasLimit,
        sender,
        jobId: eJobId,
        blockNumber
      } = coordinatorLog.args

      // Create a RequestCommitment object
      const requestCommitment = {
        blockNum: blockNumber,
        callbackGasLimit: eCallbackGasLimit,
        sender,
        jobId: jobId
      }

      await expect(coordinator.fulfillDataRequestBytes(requestId, encodedData, requestCommitment))
        .to.emit(coordinator, 'DataRequestFulfilledBytes')
        .withArgs(requestId, encodedData, true)

      // Check if lastBytes was updated
      const lastBytes = await mockADCSConsumer.lastResponse()
      expect(lastBytes).to.equal(encodedData)
      // Check decoded data in contract
      const [decodedSymbol, decodedSignal] = await mockADCSConsumer.getLastDecodedData()
      console.log('decodedSymbol', decodedSymbol, decodedSignal)
      expect(decodedSymbol).to.equal(symbol)
      expect(decodedSignal).to.equal(signal)
    })
  })

  // Add tests for other functions in MockADCSConsumer
})
