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

  async generateSignMessage(address: string): Promise<string> {
    const nonce = crypto.randomBytes(32).toString('hex')
    const timestamp = Date.now()

    // Store the nonce and timestamp in the database
    await this.prisma.user.upsert({
      where: { walletAddress: address },
      update: { nonce, nonceTimestamp: new Date(timestamp) },
      create: { walletAddress: address, nonce, nonceTimestamp: new Date(timestamp) }
    })

    return this.getMessage(nonce, timestamp)
  }

  async verifySignedMessage(address: string, signature: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { walletAddress: address } })

    if (!user || !user.nonce || !user.nonceTimestamp) {
      return false
    }

    const message = this.getMessage(user.nonce, Number(user.nonceTimestamp))

    try {
      const recoveredAddress = verifyMessage(message, signature)
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return false
      }

      // Clear the nonce after successful verification
      await this.prisma.user.update({
        where: { walletAddress: address },
        data: { nonce: null, nonceTimestamp: null }
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
    return `Please sign this message to authenticate:\nNonce: ${nonce}\nTimestamp: ${timestamp}`
  }
}
