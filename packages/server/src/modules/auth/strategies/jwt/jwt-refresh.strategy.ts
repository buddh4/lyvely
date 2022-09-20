import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshTokenPayload } from './jwt-payload.interface';
import { Cookies } from '../../../../core/web';
import { Headers } from '@lyvely/common';
import { LyvelyConfigurationGetter } from "../../../../core";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private authService: AuthService, private configService: ConfigService<LyvelyConfigurationGetter>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromExtractors([(req: Request) => {
          return req.cookies && req.cookies[Cookies.REFRESH];
        }])
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.refresh.secret'),
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: JwtRefreshTokenPayload) {
    const tokenString = req.cookies && req.cookies[Cookies.REFRESH];
    const visitorId = req.header(Headers.X_VISITOR_ID);
    const user = await this.authService.validateUserByJwtRefreshToken(tokenString, visitorId, payload);

    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }
}
