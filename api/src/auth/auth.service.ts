import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor() {}

  private getMessageFromUser(address: string, nonce: number): string {
    return `Signing in to Rivalz.\nAddress:${address}\nNonce: ${nonce}`
  }
}
