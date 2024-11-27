import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { loadJson, loadMigration, updateMigration } from '../../scripts/utils'
import path from 'path'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const migrationDirPath = `./migration/${network.name}/tradeMeme`
  const migrationFilesNames = await loadMigration(migrationDirPath)
  const config = await loadJson(path.join(migrationDirPath, migrationFilesNames[0]))

  console.log('Deploying MockTradeMemeCoin...')
  await deploy('MockTradeMemeCoin', {
    from: deployer,
    args: [
      config.deploy.coordinatorAddress,
      config.deploy.wethAddress,
      config.deploy.routerAddress
    ],
    log: true
  })

  await updateMigration(migrationDirPath, migrationFilesNames[0])
}

func.tags = ['MockTradeMemeCoin']
export default func
