import { HardhatRuntimeEnvironment } from 'hardhat/types'
import path from 'node:path'
import {
  loadJson,
  loadMigration,
  updateMigration,
  validateCoordinatorDeployConfig,
  validateSetConfig
} from '../../scripts/utils'

module.exports = async ({
  getNamedAccounts,
  deployments,
  network,
  ethers
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const migrationDirPath = `./migration/${network.name}/ADCS`
  const migrationFilesNames = await loadMigration(migrationDirPath)

  for (const migration of migrationFilesNames) {
    const config = await loadJson(path.join(migrationDirPath, migration))

    let ADCSCoordinator = config.ADCSCoordinatorAddress
      ? await ethers.getContractAt('ADCSCoordinator', config.ADCSCoordinatorAddress)
      : undefined

    // Deploy ADCSCoordinator if specified in config
    if (config.deploy) {
      console.log('Deploying ADCSCoordinator...')

      if (!validateCoordinatorDeployConfig(config.deploy)) {
        throw new Error('Invalid ADCS deploy config')
      }

      const ADCSCoordinatorName = `ADCSCoordinator_${config.deploy.version}`
      const ADCSDeployment = await deploy(ADCSCoordinatorName, {
        contract: 'ADCSCoordinator',
        args: [],
        from: deployer,
        log: true
      })

      ADCSCoordinator = await ethers.getContractAt('ADCSCoordinator', ADCSDeployment.address)
    }

    if (!ADCSCoordinator) {
      throw new Error('ADCSCoordinator is not deployed or address is missing in config.')
    }

    // Helper function to process Oracle registration/deregistration
    const processOracles = async (action: string, oracles: string[], method: string) => {
      console.log(`${action} Oracles...`)

      await Promise.all(
        oracles.map(async (oracle) => {
          const tx = await (await (ADCSCoordinator as any)[method](oracle)).wait()
          const log = ADCSCoordinator.interface.parseLog(tx.logs[0])
          console.log(`${action} Oracle`, log?.args.oracle)
        })
      )
    }

    // Register Oracles
    if (config.registerOracle) {
      await processOracles('Registering', config.registerOracle, 'registerOracle')
    }

    // Deregister Oracles
    if (config.deregisterOracle) {
      await processOracles('Deregistering', config.deregisterOracle, 'deregisterOracle')
    }

    // Configure ADCSCoordinator
    if (config.setConfig) {
      console.log('Setting ADCSCoordinator Config...')

      if (!validateSetConfig(config.setConfig)) {
        throw new Error('Invalid ADCS setConfig config')
      }

      const { maxGasLimit, gasAfterPaymentCalculation } = config.setConfig
      await (await ADCSCoordinator.setConfig(maxGasLimit, gasAfterPaymentCalculation)).wait()
      console.log('Configuration updated successfully.')
    }

    // Update migration status
    await updateMigration(migrationDirPath, migration)
    console.log(`Migration ${migration} processed successfully.`)
  }
}
