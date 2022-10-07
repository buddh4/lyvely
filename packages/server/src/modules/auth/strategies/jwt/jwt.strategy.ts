import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAccessTokenPayloadIF } from './jwt-payload.interface';
import { Cookies } from '@/modules/core';
import { ConfigurationPath } from '@/modules/app-config';
import { User, UsersService } from '@/modules/users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService, private configService: ConfigService<ConfigurationPath>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies && req.cookies[Cookies.AUTHENTICATION];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.access.secret'),
    });
  }

  async validate(payload: JwtAccessTokenPayloadIF) {
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
