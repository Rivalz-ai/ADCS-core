import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Param,
  UseGuards,
  Req,
  Get,
  Delete
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { VerifySignatureDto } from './dto/verify.dto'
import { JwtAuthGuard } from './auth.guard'
import { Request } from 'express'

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

  @Post('api-key/:name')
  @ApiOperation({ summary: 'Generate an API key for a user' })
  @ApiResponse({ status: 200, description: 'Returns an API key for the user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  async generateApiKey(@Req() req: Request, @Param('name') name: string) {
    return {
      message: 'success',
      data: await this.authService.generateApiKey(req.user['address'], req.user['userId'], name)
    }
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'Get all API keys for a user' })
  @ApiResponse({ status: 200, description: 'Returns all API keys for the user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  async getApiKeys(@Req() req: Request) {
    return { message: 'success', data: await this.authService.apiKeys(req.user['userId']) }
  }

  @Delete('api-key/:id')
  @ApiOperation({ summary: 'Delete an API key for a user' })
  @ApiResponse({ status: 200, description: 'Returns the deleted API key' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  async deleteApiKey(@Param('id') id: string, @Req() req: Request) {
    return {
      message: 'success',
      data: await this.authService.deleteApiKey(parseInt(id), req.user['userId'])
    }
  }
}
