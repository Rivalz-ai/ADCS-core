import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JWT_SECRET } from 'src/app.settings'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET
    })
  }

  async validate(payload: any): Promise<any> {
    const { sub } = payload
    if (!sub) {
      throw new UnauthorizedException('Invalid token')
    }

    if (!sub.address) {
      throw new UnauthorizedException('Invalid token')
    }

    return {
      address: sub.address.toLowerCase(),
      userId: sub.userId
    }
  }
}
