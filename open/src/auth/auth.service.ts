import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'crypto'
import { verifyMessage } from 'ethers'
import { JWT_API_EXP, JWT_EXP } from '../app.settings'
import { UserApiKey } from '@prisma/client'

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
      const user = await this.prisma.user.upsert({
        where: { walletAddress: lowerCaseAddress },
        update: {},
        create: {
          walletAddress: lowerCaseAddress,
          nonce: 0,
          nonceTimestamp: new Date()
        }
      })

      return await this.generateJwtToken(lowerCaseAddress, user.id)
    } catch (error) {
      console.error('Error verifying signature:', error)
      return ''
    }
  }

  async generateJwtToken(
    address: string,
    userId: number,
    expireTime: string = JWT_EXP
  ): Promise<string> {
    const payload = { sub: { address, userId } }
    return this.jwtService.sign(payload, { expiresIn: expireTime })
  }

  private getMessage(nonce: string, timestamp: number): string {
    return `Please sign this message to authenticate: Nonce: ${nonce} Timestamp: ${timestamp}`
  }

  async generateApiKey(address: string, userId: number, name: string): Promise<string> {
    const apiKey = await this.generateJwtToken(address, userId, JWT_API_EXP)
    await this.prisma.userApiKey.create({
      data: {
        userId,
        apiKey,
        name,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    })
    return apiKey
  }

  async apiKeys(userId: number): Promise<UserApiKey[]> {
    return this.prisma.userApiKey.findMany({
      where: { userId }
    })
  }

  async deleteApiKey(apiKeyId: number, userId: number): Promise<void> {
    const apiKey = await this.prisma.userApiKey.findUnique({
      where: { id: apiKeyId, userId }
    })
    if (!apiKey) {
      throw new HttpException('API key not found', HttpStatus.NOT_FOUND)
    }
    await this.prisma.userApiKey.delete({
      where: { id: apiKeyId, userId }
    })
  }
}
