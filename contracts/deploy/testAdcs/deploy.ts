import { HardhatRuntimeEnvironment } from 'hardhat/types'

module.exports = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const testAdcsDeployment = await deploy('TestAdcs', {
    contract: 'TestAdcs',
    args: [],
    from: deployer,
    log: true
  })

  console.log('TestAdcs deployed at', testAdcsDeployment.address)
}
