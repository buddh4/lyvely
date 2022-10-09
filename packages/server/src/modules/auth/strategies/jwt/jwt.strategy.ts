import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAccessTokenPayloadIF, PURPOSE_ACCESS_TOKEN } from './jwt-payload.interface';
import { Cookies } from '@/modules/core';
import { ConfigurationPath } from '@/modules/app-config';
import { User, UsersService } from '@/modules/users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService, private configService: ConfigService<ConfigurationPath>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req.cookies && req.cookies[JwtStrategy.getAuthCookieName(configService.get('auth.jwt.secure-cookies', true))],
      ]),
      issuer: configService.get('auth.jwt.issuer'),
      algorithms: ['HS256', 'RS256'],
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.access.secret'),
    });
  }

  static getAuthCookieName(secure: boolean) {
    return secure ? Cookies.AUTHENTICATION_HOST : Cookies.AUTHENTICATION;
  }

  async validate(payload: JwtAccessTokenPayloadIF) {
    if (payload.purpose !== PURPOSE_ACCESS_TOKEN) {
      throw new UnauthorizedException('Invalid token purpose used as access token.');
    }

    const user = await this.validateUserByJwtAccessToken(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateUserByJwtAccessToken(payload: JwtAccessTokenPayloadIF): Promise<User | null> {
    return await this.usersService.findUserById(payload.sub);
  }
}
