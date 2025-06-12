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

  const migrationDirPath = `./migration/${network.name}/adcs`
  const migrationFilesNames = await loadMigration(migrationDirPath)
  console.log(migrationFilesNames)
  const balance = await ethers.provider.getBalance(deployer)
  console.log({ deployer, balance })

  for (const migration of migrationFilesNames) {
    const config = await loadJson(path.join(migrationDirPath, migration))
    console.log({ config })
    let ADCSCoordinator = undefined

    // Deploy ADCSCoordinator ////////////////////////////////////////
    if (config.deploy) {
      console.log('deploy')
      const deployConfig = config.deploy
      if (!validateCoordinatorDeployConfig(deployConfig)) {
        throw new Error('Invalid RRC deploy config')
      }

      const ADCSCoordinatorName = `ADCSCoordinator_${deployConfig.version}`

      const ADCSDeployment = await deploy(ADCSCoordinatorName, {
        contract: 'ADCSCoordinator',
        args: [],
        from: deployer,
        log: true
      })

      console.log('deployed', ADCSDeployment.address)

      ADCSCoordinator = await ethers.getContractAt('ADCSCoordinator', ADCSDeployment.address)
    }

    ADCSCoordinator = ADCSCoordinator
      ? ADCSCoordinator
      : await ethers.getContractAt('ADCSCoordinator', config.ADCSCoordinatorAddress)

    // Register Oracle //////////////////////////////////////////////////////////
    if (config.registerOracle) {
      console.log('registerOracle', await ADCSCoordinator.getAddress())

      for (const oracle of config.registerOracle) {
        const tx: any = await (await ADCSCoordinator.registerOracle(oracle)).wait()
        const log = ADCSCoordinator.interface.parseLog(tx.logs[0])
        console.log('Oracle Registered', log?.args.oracle)
      }
    }

    // Deregister Oracle ////////////////////////////////////////////////////////
    if (config.deregisterOracle) {
      console.log('deregisterOracle')

      for (const oracle of config.deregisterOracle) {
        const tx: any = await (await ADCSCoordinator.deregisterOracle(oracle)).wait()
        const log = ADCSCoordinator.interface.parseLog(tx.logs[0])
        console.log('Oracle Deregistered', log?.args.oracle)
      }
    }

    // Configure Request-Response coordinator ///////////////////////////////////
    if (config.setConfig) {
      console.log('setConfig')
      const setConfig = config.setConfig
      if (!validateSetConfig(setConfig)) {
        throw new Error('Invalid RRC setConfig config')
      }

      await (
        await ADCSCoordinator.setConfig(setConfig.maxGasLimit, setConfig.gasAfterPaymentCalculation)
      ).wait()
    }
    await updateMigration(migrationDirPath, migration)
  }
}
