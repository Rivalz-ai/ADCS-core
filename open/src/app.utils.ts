import { Contract, InterfaceAbi, JsonRpcProvider, Wallet, formatUnits, parseUnits } from 'ethers'
import { appendFile, readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { RPC_URL } from './app.settings'

export async function abis(name: string) {
  const path = join(__dirname, '..', 'abis', `${name}.json`)
  return JSON.parse(await readFile(path, 'utf8'))
}

export async function transactionReceipt(hash: string) {
  const provider = new JsonRpcProvider(RPC_URL)

  return await provider.getTransactionReceipt(hash)
}

export async function getBlock(number: number) {
  const provider = new JsonRpcProvider(RPC_URL)
  return await provider.getBlock(number)
}

export function formatShard(value: bigint) {
  return formatUnits(value, 8)
}

export function parseShard(value: number) {
  return parseUnits(value.toString(), 8)
}

export function createContract(contractAddress: string, abis: InterfaceAbi) {
  const provider = new JsonRpcProvider(RPC_URL)
  return new Contract(contractAddress, abis, provider)
}

export function add0x(s) {
  if (s.substring(0, 2) == '0x') {
    return s
  } else {
    return '0x' + s
  }
}

export async function sendTransaction({
  wallet,
  to,
  payload,
  gasLimit,
  value
}: {
  wallet: Wallet
  to: string
  payload?: string
  gasLimit?: number | string
  value?: number | string
}) {
  if (payload) {
    payload = add0x(payload)
  }
  const tx = {
    from: await wallet.getAddress(),
    to: to,
    data: payload || '0x00',
    value: value || '0x00'
  }

  if (gasLimit) {
    tx['gasLimit'] = gasLimit
  }

  try {
    await wallet.call(tx)
    const txReceipt = await (await wallet.sendTransaction(tx)).wait(1)
    return txReceipt
  } catch (e) {
    let msg
    let error
    if (e.reason == 'invalid address') {
      msg = `TxInvalidAddress ${e.value}`
    } else if (e.reason == 'processing response error') {
      msg = `TxProcessingResponseError ${e.value}`
    } else if (e.reason == 'missing response') {
      msg = 'TxMissingResponseError'
    } else if (e.reason == 'transaction failed') {
      msg = 'TxTransactionFailed'
    } else if (e.reason == 'insufficient funds for intrinsic transaction cost') {
      msg = 'TxInsufficientFunds'
    } else if (e.code == 'UNPREDICTABLE_GAS_LIMIT') {
      msg = 'TxCannotEstimateGasError'
    } else {
      error = e
    }
    console.log({ msg, error })
  }
  return undefined
}

export async function loadFilesFromDir(dirPath: string, lockFileName: string): Promise<string[]> {
  const jsonFileRegex = /\.csv$/

  let lockFileExist = false
  const allMigrations = []

  try {
    const files = await readdir(dirPath)

    for (const file of files) {
      if (file === lockFileName) {
        lockFileExist = true
      } else if (jsonFileRegex.test(file.toLowerCase())) {
        allMigrations.push(file)
      }
    }
  } catch (err) {
    console.error(err)
  }

  let doneFiles: any[] = []
  if (lockFileExist) {
    const lockFilePath = join(dirPath, lockFileName)
    doneFiles = await readMigrationLockFile(lockFilePath)
  }

  // Keep only those migrations that have not been applied yet
  const todoMigrations = allMigrations.filter((x) => !doneFiles.includes(x))
  todoMigrations.sort()
  return todoMigrations
}

async function readMigrationLockFile(filePath: string) {
  return (await readFile(filePath, 'utf8')).toString().trim().split('\n')
}
export async function updateLockFile(
  dirPath: string,
  migrationFileName: string,
  lockFileName: string
) {
  const migrationLockFilePath = join(dirPath, lockFileName)
  await appendFile(migrationLockFilePath, `${migrationFileName}\n`)
}
