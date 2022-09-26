import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshTokenPayload } from './jwt-payload.interface';
import { Cookies } from '../../../core/web';
import { Headers } from '@lyvely/common';
import { ConfigurationPath } from "../../../core";
import { User, UsersService } from "../../../users";
import bcrypt from "bcrypt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private usersService: UsersService, private configService: ConfigService<ConfigurationPath>) {
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
    const user = await this.validateUserByJwtRefreshToken(tokenString, visitorId, payload);

    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }

  async validateUserByJwtRefreshToken(tokenString: string, visitorId: string, payload: JwtRefreshTokenPayload): Promise<User|null> {
    if(!tokenString || !visitorId) {
      return null;
    }

    const user = await this.usersService.findUserById(payload.sub);

    if (!user) {
      return null;
    }

    const refreshTokenItem = user.getRefreshTokenByVisitorId(visitorId);

    if(!refreshTokenItem) return null;

    const isRefreshTokenMatching = await bcrypt.compare(tokenString, refreshTokenItem.hash);
    return isRefreshTokenMatching ? user : null;
  }
}
