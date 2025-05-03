import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)

  const tx = await deployer.sendTransaction({
    to: '0x122933E746C112B586Ea3D6371E91DCAaCbC7AbE',
    value: ethers.parseEther('1')
  })
  await tx.wait()
  console.log('Transaction sent:', tx.hash)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
