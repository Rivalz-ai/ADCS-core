import { readdir, readFile, appendFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import moment from 'moment'
import { writeFileSync } from 'node:fs'
const MIGRATION_LOCK_FILE_NAME = 'migration.lock'

export async function loadJson(filepath: string) {
  try {
    const json = await readFile(filepath, 'utf8')
    return JSON.parse(json)
  } catch (e) {
    console.error(e)
    throw e
  }
}

async function storeJson(filepath: string, data: any) {
  try {
    writeFileSync(filepath, data)
  } catch (e) {
    console.error(e)
    throw e
  }
}

async function readMigrationLockFile(filePath: string) {
  return (await readFile(filePath, 'utf8')).toString().trim().split('\n')
}

/**
 * Migrations directory includes migration JSON files and migration lock file.
 * Migration JSON files should have a names that explains the
 * migration purpose and which can be chronological order. If there is
 * no migration lock file, we assume that no migration has been run
 * yet. `loadMigration` function examines migration JSON files,
 * migration lock file and determines which migration JSON files
 * should be used for next migration.
 *
 * @param {string} migrations directory
 * @return {Promise<string[]>} list of migration files names that has
 * not been applied yet
 */
export async function loadMigration(dirPath: string): Promise<string[]> {
  const jsonFileRegex = /\.json$/

  let migrationLockFileExist = false
  const allMigrations = []

  try {
    const files = await readdir(dirPath)

    for (const file of files) {
      if (file === MIGRATION_LOCK_FILE_NAME) {
        migrationLockFileExist = true
      } else if (jsonFileRegex.test(file.toLowerCase())) {
        allMigrations.push(file)
      }
    }
  } catch (err) {
    console.error(err)
  }

  let doneMigrations: any[] = []
  if (migrationLockFileExist) {
    const migrationLockFilePath = path.join(dirPath, MIGRATION_LOCK_FILE_NAME)
    doneMigrations = await readMigrationLockFile(migrationLockFilePath)
  }

  // Keep only those migrations that have not been applied yet
  const todoMigrations = allMigrations.filter((x) => !doneMigrations.includes(x))
  todoMigrations.sort()
  return todoMigrations
}

/**
 * Update migration lock file located in `dirPath` with the `migrationFileName` migration.
 *
 * @params {string} migration directory
 * @params {string} name of executed migration file that should be included to migration lock file
 * @return {Promise<void>}
 */
export async function updateMigration(dirPath: string, migrationFileName: string) {
  const migrationLockFilePath = path.join(dirPath, MIGRATION_LOCK_FILE_NAME)
  await appendFile(migrationLockFilePath, `${migrationFileName}\n`)
}

function validateProperties(config: any, requiredProperties: any) {
  for (const rp of requiredProperties) {
    if (config[rp] === undefined) return false
  }

  return true
}

/**
 * @params {IAggregatorDeployConfig}
 * @return {boolean}
 */
export function validateAggregatorDeployConfig(config: any): boolean {
  const requiredProperties = ['name', 'timeout', 'validator', 'decimals', 'description']

  if (!validateProperties(config, requiredProperties)) return false

  if (config.paymentAmount > 0 && config.depositAmount && config.depositAmount > 0) {
    return false
  }

  return true
}

/**
 * @params {IAggregatorChangeOraclesConfig}
 * @return {boolean}
 */
export function validateAggregatorChangeOraclesConfig(config: any): boolean {
  const requiredProperties = [
    'removed',
    'added',
    'minSubmissionCount',
    'maxSubmissionCount',
    'restartDelay'
  ]

  if (!validateProperties(config, requiredProperties)) {
    return false
  } else {
    return true
  }
}

/**
 * @params {ICoordinatorDeploy}
 * @return {boolean}
 */
export function validateCoordinatorDeployConfig(config: any): boolean {
  const requiredProperties = ['version']

  if (!validateProperties(config, requiredProperties)) {
    return false
  } else {
    return true
  }
}

/**
 * @params {ICoordinatorConfig}
 * @return {boolean}
 */
export function validateSetConfig(config: any): boolean {
  const requiredProperties = ['maxGasLimit', 'gasAfterPaymentCalculation']

  if (!validateProperties(config, requiredProperties)) {
    return false
  } else {
    return true
  }
}

/**
 * @params {IRegisterOracle[]}
 * @return {boolean}
 */
export function validateVrfRegisterOracle(config: any): boolean {
  const requiredProperties = ['address', 'publicProvingKey']

  for (const c of config) {
    if (!validateProperties(c, requiredProperties)) {
      return false
    }
  }

  return true
}

/**
 * @params {IDeregisterOracle[]}
 * @return {boolean}
 */
export function validateVrfDeregisterOracle(config: any): boolean {
  const requiredProperties = ['address']

  for (const c of config) {
    if (!validateProperties(c, requiredProperties)) {
      return false
    }
  }

  return true
}

/**
 * @params {IPrepaymentDeploy}
 * @return {boolean}
 */
function validatePrepaymentDeployConfig(config: any): boolean {
  const requiredProperties = ['protocolFeeRecipient']

  if (!validateProperties(config, requiredProperties)) {
    return false
  } else {
    return true
  }
}

export function validateAggregatorRedirectProxyConfig(config: any): boolean {
  const requiredProperties = ['status', 'proxyAddress', 'aggregator']

  if (!validateProperties(config, requiredProperties)) {
    return false
  } else {
    return true
  }
}

export function getFormattedDate() {
  return moment().format('YYYYMMDDHHMMSS')
}

// returns object with {key(contractName):value(address)} inside dirPath
export async function loadDeployments(dirPath: string) {
  const jsonFileRegex = /\.json$/
  const result: any = {}
  try {
    const files = await readdir(dirPath)

    for (const file of files) {
      if (jsonFileRegex.test(file.toLowerCase())) {
        let contractName = path.basename(file, '.json')
        if (contractName.split('_').length > 1) {
          // remove last part which normally holds version name
          const splitted = contractName.replace(' ', '').split('_')
          splitted.pop()
          contractName = splitted.join('_')
        }
        const filePath = path.join(dirPath, file)
        const deploymentDetail = await loadJson(filePath)
        const address = deploymentDetail.address
        if (!address) {
          continue
        }
        result[contractName] = address
      }
    }
  } catch (err) {
    console.error(err)
  }

  return result
}
