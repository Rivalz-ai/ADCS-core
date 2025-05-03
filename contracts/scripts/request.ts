import { getContractFactory } from '@nomicfoundation/hardhat-ethers/types'
import { deployments, ethers } from 'hardhat'
import { MockADCSConsumer__factory } from '../typechain'
async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  const coordinatorDeployment = await deployments.get('ADCSConsumer_v0.1')
  console.log('MockADCSCoordinator deployed at', coordinatorDeployment.address)
  const consumerMock = MockADCSConsumer__factory.connect(coordinatorDeployment.address, deployer)
  const tx = await consumerMock.requestUint256Data(
    '1000000',
    '0x1b364865ca3e6bb5ada098d0ea96f9e9369b5693cacede79d1352334c4213ac2',
    'bitcoin',
    'usd'
  )
  await tx.wait()
  console.log('Transaction sent:', tx.hash)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
