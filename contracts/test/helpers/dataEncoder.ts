import { ethers } from 'ethers'

export class DataEncoder {
  // Encode [string, boolean] array
  static encodeCoinData(symbol: string, signal: boolean): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(['string', 'bool'], [symbol, signal])
  }

  // Encode uint256
  static encodeUint256(value: string | number): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [value])
  }

  // Encode boolean
  static encodeBool(value: boolean): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(['bool'], [value])
  }

  // Encode string
  static encodeString(value: string): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(['string'], [value])
  }

  // Encode bytes32
  static encodeBytes32(value: string): string {
    const bytes32Value = ethers.encodeBytes32String(value)
    return ethers.AbiCoder.defaultAbiCoder().encode(['bytes32'], [bytes32Value])
  }

  // Example of encoding multiple values
  static encodeMultiple(values: any[], types: string[]): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(types, values)
  }
}
