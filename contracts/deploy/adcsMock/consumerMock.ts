import { HardhatRuntimeEnvironment } from 'hardhat/types'

module.exports = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const coordinatorDeployment = await deployments.get('ADCSCoordinator_v0.1')

  const ADCSConsumerName = `ADCSConsumer_v0.1`

  const ADCSConsumerDeployment = await deploy(ADCSConsumerName, {
    contract: 'MockADCSConsumer',
    args: [coordinatorDeployment.address],
    from: deployer,
    log: true
  })

  console.log('MockADCSConsumer deployed at', ADCSConsumerDeployment.address)
}
