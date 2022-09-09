import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAccessTokenPayload } from './jwt-payload.interface';
import { Cookies } from '../../../core/web';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        return req.cookies && req.cookies[Cookies.AUTHENTICATION];
      }]),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.access.secret'),
    });
  }

  async validate(payload: JwtAccessTokenPayload) {
    const user = await this.authService.validateUserByJwtAccessToken(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
