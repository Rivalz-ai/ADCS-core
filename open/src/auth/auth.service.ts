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

  async verifySignedMessage(message: string, signature: string): Promise<string> {
    try {
      const recoveredAddress = verifyMessage(message, signature)
      // insert user into db,update if already exists
      const lowerCaseAddress = recoveredAddress.toLowerCase()
      await this.prisma.user.upsert({
        where: { walletAddress: lowerCaseAddress },
        update: {},
        create: {
          walletAddress: lowerCaseAddress,
          nonce: 0,
          nonceTimestamp: new Date()
        }
      })

      return await this.generateJwtToken(lowerCaseAddress)
    } catch (error) {
      console.error('Error verifying signature:', error)
      return ''
    }
  }

  async generateJwtToken(address: string): Promise<string> {
    const payload = { sub: { address } }
    return this.jwtService.sign(payload)
  }

  private getMessage(nonce: string, timestamp: number): string {
    return `Please sign this message to authenticate: Nonce: ${nonce} Timestamp: ${timestamp}`
  }
}
