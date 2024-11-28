import { Controller, Post, Body, UnauthorizedException, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { VerifySignatureDto } from './dto/verify.dto'

@ApiTags('Authorization')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-message/:address')
  @ApiOperation({ summary: 'Get a message to sign for authentication' })
  @ApiResponse({ status: 200, description: 'Returns a message to be signed by the user' })
  async getSignMessage(@Param('address') address: string) {
    return this.authService.generateSignMessage(address)
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a signed message for authentication' })
  @ApiResponse({ status: 200, description: 'Returns JWT token if the signature is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized if the signature is invalid' })
  async verifySignature(@Body() verifySignatureDto: VerifySignatureDto) {
    const token = await this.authService.verifySignedMessage(
      verifySignatureDto.message,
      verifySignatureDto.signature
    )
    if (!token) {
      throw new UnauthorizedException('Invalid signature')
    }
    return { accessToken: token }
  }
}
