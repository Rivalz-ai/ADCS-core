import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service'

@ApiTags('Authorization')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-message')
  @ApiOperation({ summary: 'Get a message to sign for authentication' })
  @ApiResponse({ status: 200, description: 'Returns a message to be signed by the user' })
  async getSignMessage(@Body('address') address: string) {
    return this.authService.generateSignMessage(address)
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a signed message for authentication' })
  @ApiResponse({ status: 200, description: 'Returns JWT token if the signature is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized if the signature is invalid' })
  async verifySignature(@Body() body: { address: string; signature: string }) {
    const isValid = await this.authService.verifySignedMessage(body.address, body.signature)
    if (isValid) {
      const jwtToken = await this.authService.generateJwtToken(body.address)
      return { authenticated: true, token: jwtToken }
    } else {
      throw new UnauthorizedException('Invalid signature')
    }
  }
}
