import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'crypto'
import { verifyMessage } from 'ethers'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async generateSignMessage(address: string): Promise<{ message: string }> {
    const nonce = crypto.randomBytes(32).toString('hex')
    const timestamp = Date.now()

    return { message: this.getMessage(nonce, timestamp) }
  }

  async verifySignedMessage(message: string, signature: string): Promise<boolean> {
    try {
      const recoveredAddress = verifyMessage(message, signature)
      // insert user into db,update if already exists
      await this.prisma.user.upsert({
        where: { walletAddress: recoveredAddress },
        update: { walletAddress: recoveredAddress },
        create: { walletAddress: recoveredAddress, nonce: null, nonceTimestamp: null }
      })

      return true
    } catch (error) {
      console.error('Error verifying signature:', error)
      return false
    }
  }

  async generateJwtToken(address: string): Promise<string> {
    const payload = { sub: address }
    return this.jwtService.sign(payload)
  }

  private getMessage(nonce: string, timestamp: number): string {
    return `Please sign this message to authenticate: Nonce: ${nonce} Timestamp: ${timestamp}`
  }
}
