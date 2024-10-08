import { expect, use } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { ADCSCoordinator } from '../typechain'
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('ADCSCoordinator', function () {
  // Deploy fixture function
  async function deployADCSCoordinatorFixture() {
    const [owner, otherAccount] = await ethers.getSigners()

    const ADCSCoordinator = await ethers.getContractFactory('ADCSCoordinator')
    const adcsCoordinator = await ADCSCoordinator.deploy()

    return { adcsCoordinator, owner, otherAccount }
  }

  // Test cases
  describe('Deployment', function () {
    it('Should deploy successfully', async function () {
      const { adcsCoordinator } = await loadFixture(deployADCSCoordinatorFixture)
    })
    // Add more deployment-related tests here
  })

  describe('Functionality', function () {
    it('Should have correct initial state', async function () {
      const { adcsCoordinator } = await loadFixture(deployADCSCoordinatorFixture)
    })

    // Add more functionality tests here
    it('Should register an oracle', async function () {
      const { adcsCoordinator, owner, otherAccount } = await loadFixture(
        deployADCSCoordinatorFixture
      )
      await adcsCoordinator.registerOracle(otherAccount.address)
      expect(await adcsCoordinator.isOracleRegistered(otherAccount.address)).to.be.true
    })

    it('Should deregister an oracle', async function () {
      const { adcsCoordinator, owner, otherAccount } = await loadFixture(
        deployADCSCoordinatorFixture
      )
      await adcsCoordinator.registerOracle(otherAccount.address)
      await adcsCoordinator.deregisterOracle(otherAccount.address)
      expect(await adcsCoordinator.isOracleRegistered(otherAccount.address)).to.be.false
    })

    it('Should revert when deregistering a non-existent oracle', async function () {
      const { adcsCoordinator, otherAccount } = await loadFixture(deployADCSCoordinatorFixture)
      await expect(
        adcsCoordinator.deregisterOracle(await otherAccount.getAddress())
      ).to.be.rejectedWith('NoSuchOracle')
    })

    it('Should return correct type and version', async function () {
      const { adcsCoordinator } = await loadFixture(deployADCSCoordinatorFixture)
      expect(await adcsCoordinator.typeAndVersion()).to.equal('ADCSCoordinator v0.1')
    })

    it('Should request data correctly', async function () {
      const { adcsCoordinator, owner } = await loadFixture(deployADCSCoordinatorFixture)
      const callbackGasLimit = 200000
      const req = {
        id: ethers.encodeBytes32String('testJobId'),
        callbackAddr: owner.address,
        callbackFunc: '0x12345678',
        nonce: 1,
        data: '0x1234',
        buf: {
          data: '0x1234',
          len: 4
        }
      }

      await adcsCoordinator.setConfig(2500000, 90000) // Set maxGasLimit to 200000

      const tx = await adcsCoordinator.requestData(callbackGasLimit, {
        ...req,
        buf: {
          buf: req.buf.data,
          capacity: req.buf.len
        }
      })

      expect(tx)
        .to.emit(adcsCoordinator, 'DataRequested')
        .withArgs(req.id, owner.address, req.callbackAddr, req.callbackFunc, 0)
    })

    it('Should revert when requesting data with gas limit too big', async function () {
      const { adcsCoordinator } = await loadFixture(deployADCSCoordinatorFixture)
      const callbackGasLimit = 3000000
      const req = {
        id: ethers.encodeBytes32String('testJobId'),
        callbackAddr: await adcsCoordinator.getAddress(),
        callbackFunc: '0x12345678',
        nonce: 1,
        data: '0x1234',
        buf: {
          data: '0x1234',
          len: 4
        }
      }

      await adcsCoordinator.setConfig(2500000, 90000) // Set maxGasLimit to 200000

      await expect(
        adcsCoordinator.requestData(callbackGasLimit, {
          ...req,
          buf: {
            buf: req.buf.data,
            capacity: req.buf.len
          }
        })
      ).to.be.rejectedWith('GasLimitTooBig')
    })

    // Add more tests for other functions like fulfill, validateDataResponse, etc.
  })

  // Add more describe blocks for different aspects of the contract
})
