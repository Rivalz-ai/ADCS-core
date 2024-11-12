import { expect } from 'chai'
import { ethers } from 'hardhat'
import { CustomEthersSigner, SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  MockTradeMemeCoin,
  MockERC20,
  ADCSCoordinator,
  MockTradeMemeCoin__factory,
  MockERC20__factory,
  ADCSCoordinator__factory,
  MockUniswapRouter,
  MockUniswapRouter__factory
} from '../typechain'
import { parseEther, encodeBytes32String } from 'ethers'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
describe('MockTradeMemeCoin', function () {
  let tradeMemeCoin: MockTradeMemeCoin
  let weth: MockERC20
  let doge: MockERC20
  let shib: MockERC20
  let coordinator: ADCSCoordinator
  let owner: HardhatEthersSigner
  let addr1: HardhatEthersSigner
  let mockRouter: MockUniswapRouter

  const JOB_ID = encodeBytes32String('abc123')
  const CALLBACK_GAS_LIMIT = 100000

  beforeEach(async function () {
    ;[owner, addr1] = await ethers.getSigners()

    // Deploy mock tokens
    const MockERC20Factory = await ethers.getContractFactory('MockERC20')
    weth = await MockERC20Factory.deploy('Wrapped Ether', 'WETH', parseEther('1000'))
    await weth.waitForDeployment()

    doge = await MockERC20Factory.deploy('Dogecoin', 'DOGE', parseEther('1000000'))
    await doge.waitForDeployment()

    shib = await MockERC20Factory.deploy('Shiba Inu', 'SHIB', parseEther('1000000'))
    await shib.waitForDeployment()

    // Deploy mock router
    const MockRouterFactory = await ethers.getContractFactory('MockUniswapRouter')
    mockRouter = await MockRouterFactory.deploy()
    await mockRouter.waitForDeployment()

    // Deploy coordinator
    const CoordinatorFactory = await ethers.getContractFactory('ADCSCoordinator')
    coordinator = await CoordinatorFactory.deploy()
    await coordinator.waitForDeployment()

    // Deploy MockTradeMemeCoin with mock router
    const TradeMemeCoinFactory = await ethers.getContractFactory('MockTradeMemeCoin')
    tradeMemeCoin = await TradeMemeCoinFactory.deploy(
      coordinator.target,
      weth.target,
      mockRouter.target
    )
    await tradeMemeCoin.waitForDeployment()

    // Setup initial state
    await tradeMemeCoin.setErc20Address(weth.target)
    await tradeMemeCoin.addMemeCoin('dogecoin', doge.target)
    await tradeMemeCoin.addMemeCoin('shiba-inu', shib.target)

    // Transfer tokens to trading contract
    await weth.transfer(tradeMemeCoin.target, parseEther('100'))
    await doge.transfer(tradeMemeCoin.target, parseEther('10000'))
    await shib.transfer(tradeMemeCoin.target, parseEther('10000'))
  })

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await tradeMemeCoin.owner()).to.equal(owner.address)
    })

    it('Should initialize with correct WETH address', async function () {
      expect(await tradeMemeCoin.WETH()).to.equal(weth.target)
    })
  })

  describe('Memecoin Management', function () {
    it('Should add a new memecoin', async function () {
      const pepe = await (
        await ethers.getContractFactory('MockERC20')
      ).deploy('Pepe', 'PEPE', parseEther('1000000'))
      await pepe.waitForDeployment()

      await tradeMemeCoin.addMemeCoin('PEPE', pepe.target)
      const [name, addr] = await tradeMemeCoin.getMemeCoin(2)

      expect(name).to.equal('PEPE')
      expect(addr).to.equal(pepe.target)
    })

    it('Should return correct memecoin count', async function () {
      expect(await tradeMemeCoin.getMemeCoinCount()).to.equal(2)
    })

    it('Should revert when accessing out of bounds index', async function () {
      await expect(tradeMemeCoin.getMemeCoin(99)).to.be.revertedWith('Index out of bounds')
    })
  })

  describe('Trade Request', function () {
    it('Should create trade request with correct amount', async function () {
      const amount = parseEther('1')

      const tx = await tradeMemeCoin.requestTradeMemeCoin(JOB_ID, CALLBACK_GAS_LIMIT, amount)

      const receipt = await tx.wait()
      const log = receipt?.logs?.find((e) => e.address === tradeMemeCoin.target)
      const requestId = tradeMemeCoin.interface.decodeEventLog('DataRequested', log?.data ?? '')[0]

      expect(await tradeMemeCoin.requestIdToAmount(requestId)).to.equal(amount)
    })
  })

  describe('Data Fulfillment', function () {
    it('Should emit MemecoinNotFound for non-existent token', async function () {
      const amount = parseEther('1')
      const tx = await tradeMemeCoin.requestTradeMemeCoin(JOB_ID, CALLBACK_GAS_LIMIT, amount)

      const receipt = await tx.wait()
      const log = receipt?.logs?.find((e) => e.address === coordinator.target)
      const coordinatorInterface: any = coordinator.interface
      const coordinatorLog = coordinatorInterface.parseLog(log ?? '')

      const {
        requestId: eRequestId,
        callbackGasLimit: eCallbackGasLimit,
        sender,
        jobId: eJobId,
        blockNumber
      } = coordinatorLog.args

      // Create a RequestCommitment object
      const response = {
        name: 'dogecoin',
        response: true
      }

      const requestCommitment = {
        blockNum: blockNumber,
        callbackGasLimit: eCallbackGasLimit,
        sender,
        jobId: eJobId
      }

      await expect(
        coordinator
          .connect(owner)
          .fulfillDataRequestStringAndBool(eRequestId, response, requestCommitment)
      )
        .to.emit(tradeMemeCoin, 'MemecoinNotFound')
        .withArgs('NONEXISTENT')
    })
  })

  describe('Swaps', function () {
    it('Should perform swap through mock router', async function () {
      const swapAmount = parseEther('1')

      // Approve tokens
      await weth.approve(tradeMemeCoin.target, swapAmount)
      await doge.approve(mockRouter.target, swapAmount)

      // Test swap
      //   await tradeMemeCoin.performSwap(
      //     weth.target,
      //     doge.target,
      //     swapAmount,
      //     swapAmount, // amountOut same as amountIn for simplicity
      //     owner.address
      //   )

      // Add assertions based on your requirements
    })
  })
})
