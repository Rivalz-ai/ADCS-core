import { Controller } from '@nestjs/common'
import { ApiExcludeController, ApiTags } from '@nestjs/swagger'

@ApiTags('AuthorizationEndpoint')
@ApiExcludeController()
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor() {}
}
