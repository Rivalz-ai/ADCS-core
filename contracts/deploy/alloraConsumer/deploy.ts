import { HardhatRuntimeEnvironment } from 'hardhat/types'

module.exports = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const coordinatorDeployment = await deployments.get('ADCSCoordinator_v0.1')

  const ADCSConsumerName = `MockADCSConsumerUsingAllora`

  const ADCSConsumerDeployment = await deploy(ADCSConsumerName, {
    contract: 'MockADCSConsumerUsingAllora',
    args: [coordinatorDeployment.address],
    from: deployer,
    log: true
  })

  console.log('MockADCSConsumerUsingAllora deployed at', ADCSConsumerDeployment.address)
}
