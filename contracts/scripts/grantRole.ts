import { getContractFactory } from '@nomicfoundation/hardhat-ethers/types'
import { deployments, ethers, network } from 'hardhat'
import { ADCSCoordinator__factory, MockADCSConsumer__factory } from '../typechain'
import { parseEther, Wallet } from 'ethers'
async function main() {
  const [deployer] = await ethers.getSigners()
  const newAdmin = '0xed3efa70807d98a5bdcbbc0dbe742f258cedb88b'
  console.log('Deploying contracts with the account:', deployer.address, 'chain', network.name)
  const coordinatorDeployment = await deployments.get('ADCSCoordinator_v0.1')
  const coordinator = ADCSCoordinator__factory.connect(coordinatorDeployment.address, deployer)
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance', balance)
  const owner = await coordinator.owner()
  console.log('Owner', owner)

  //if (balance == 0n) {
  // send ether from admin to deployer
  //   const sendAmount = BigInt(3670123885854) - balance
  //   const admin = new Wallet(process.env.PRIV_KEY2!, ethers.provider)

  //   const txSend = await admin.sendTransaction({
  //     to: deployer.address,
  //     value: parseEther('0.00001')
  //   })
  //   await txSend.wait()
  //   console.log('Transaction sent:', txSend.hash)

  const tx = await coordinator.transferOwnership(newAdmin)

  await tx.wait()
  console.log('Transaction transferOwnership:', tx.hash)

  const newOwner = await coordinator.owner()
  console.log('New owner', newOwner)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
