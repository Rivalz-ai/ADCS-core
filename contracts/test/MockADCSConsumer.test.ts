import { expect, use } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

describe('MockADCSConsumer', function () {
  async function deployMockADCSConsumerFixture() {
    const [owner, addr1] = await ethers.getSigners()

    // Deploy ADCS Coordinator
    const MockCoordinator = await ethers.getContractFactory('ADCSCoordinator')
    const coordinator = await MockCoordinator.deploy()

    // Deploy MockADCSConsumer
    const MockADCSConsumer = await ethers.getContractFactory('MockADCSConsumer')
    const mockADCSConsumer = await MockADCSConsumer.deploy(await coordinator.getAddress())
    await coordinator.setConfig(2500000, 900000)
    await coordinator.registerOracle(await owner.getAddress())

    return { mockADCSConsumer, coordinator, owner, addr1 }
  }

  describe('requestDataUint256', function () {
    it('should emit DataRequestedUint256 event', async function () {
      const { mockADCSConsumer } = await loadFixture(deployMockADCSConsumerFixture)

      const jobId = ethers.encodeBytes32String('testJobId')
      const callbackGasLimit = 2500000

      await expect(mockADCSConsumer.requestUint256Data(callbackGasLimit, jobId)).to.emit(
        mockADCSConsumer,
        'DataRequestedUint256'
      )
    })

    it('should fulfill Uint256 request and update lastUint256', async function () {
      const { mockADCSConsumer, coordinator, owner } = await loadFixture(
        deployMockADCSConsumerFixture
      )

      const jobId = ethers.encodeBytes32String('testJobId')
      const callbackGasLimit = 2500000

      // Simulate oracle response
      const testValue = '1234'
      // Request data first to get the requestId
      const tx: any = await mockADCSConsumer.requestUint256Data(callbackGasLimit, jobId)
      const receipt = await tx.wait()
      const requestId = receipt.logs[1].args[0]
      // Parse the event log from log index 0 for the coordinator contr
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

      await expect(coordinator.fulfillDataRequestUint256(requestId, testValue, requestCommitment))
        .to.emit(coordinator, 'DataRequestFulfilledUint256')
        .withArgs(requestId, testValue, true)

      // Check if lastUint256 was updated
      const lastUint256 = await mockADCSConsumer.lastUint256()
      expect(lastUint256).to.equal(testValue)
    })

    it('should fulfill Bool request and update lastBool', async function () {
      const { mockADCSConsumer, coordinator, owner } = await loadFixture(
        deployMockADCSConsumerFixture
      )

      const jobId = ethers.encodeBytes32String('testJobId')
      const callbackGasLimit = 2500000

      // Simulate oracle response
      const testValue = true
      // Request data first to get the requestId
      const tx: any = await mockADCSConsumer.requestBoolData(callbackGasLimit, jobId)
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

      await expect(coordinator.fulfillDataRequestBool(requestId, testValue, requestCommitment))
        .to.emit(coordinator, 'DataRequestFulfilledBool')
        .withArgs(requestId, testValue, true)

      // Check if lastBool was updated
      const lastBool = await mockADCSConsumer.lastBool()
      expect(lastBool).to.equal(testValue)
    })

    it('should fulfill Bytes32 request and update lastBytes32', async function () {
      const { mockADCSConsumer, coordinator, owner } = await loadFixture(
        deployMockADCSConsumerFixture
      )

      const jobId = ethers.encodeBytes32String('testJobId')
      const callbackGasLimit = 2500000

      // Simulate oracle response
      const testValue = ethers.encodeBytes32String('testBytes32Value')
      // Request data first to get the requestId
      const tx: any = await mockADCSConsumer.requestBytes32Data(callbackGasLimit, jobId)
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

      await expect(coordinator.fulfillDataRequestBytes32(requestId, testValue, requestCommitment))
        .to.emit(coordinator, 'DataRequestFulfilledBytes32')
        .withArgs(requestId, testValue, true)

      // Check if lastBytes32 was updated
      const lastBytes32 = await mockADCSConsumer.lastBytes32()
      expect(lastBytes32).to.equal(testValue)
    })

    it('should fulfill Bytes request and update lastBytes', async function () {
      const { mockADCSConsumer, coordinator, owner } = await loadFixture(
        deployMockADCSConsumerFixture
      )

      const jobId = ethers.encodeBytes32String('testJobId')
      const callbackGasLimit = 2500000

      // Simulate oracle response
      const testValue = ethers.encodeBytes32String('testBytesValue')
      // Request data first to get the requestId
      const tx: any = await mockADCSConsumer.requestBytesData(callbackGasLimit, jobId)
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

      await expect(coordinator.fulfillDataRequestBytes(requestId, testValue, requestCommitment))
        .to.emit(coordinator, 'DataRequestFulfilledBytes')
        .withArgs(requestId, testValue, true)

      // Check if lastBytes was updated
      const lastBytes = await mockADCSConsumer.lastBytes()
      expect(lastBytes).to.equal(testValue)
    })
  })

  // Add tests for other functions in MockADCSConsumer
})
