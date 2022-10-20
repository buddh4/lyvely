import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtStrategy, JwtTokenPayloadIF } from '@/jwt';
import { Headers } from '@lyvely/common';
import { User } from '@/users';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';

const COOKIE_REFRESH = 'Refresh';
const COOKIE_REFRESH_SECURE = '__Secure-Refresh';
export const JWT_REFRESH_TOKEN = 'jwt-refresh-token';

export interface JwtRefreshTokenPayloadIF extends JwtTokenPayloadIF {
  sub: string;
  remember: boolean;
}

export function getRefreshCookieName(configService: ConfigService<ConfigurationPath>) {
  const useSecureCookies = configService.get('auth.jwt.secure-cookies', true);
  return useSecureCookies ? COOKIE_REFRESH_SECURE : COOKIE_REFRESH;
}

export function extractRefreshCookie(req: Request, configService: ConfigService<ConfigurationPath>) {
  return req.cookies && req.cookies[getRefreshCookieName(configService)];
}

export function clearRefreshCookies(res: Response) {
  res.clearCookie(COOKIE_REFRESH);
  res.clearCookie(COOKIE_REFRESH_SECURE);
}

@Injectable()
export class JwtRefreshStrategy extends JwtStrategy<JwtRefreshTokenPayloadIF>({
  name: 'jwt-refresh-token',
  options: (configService) => {
    return {
      secretOrKey: configService.get('auth.jwt.refresh.secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromExtractors([(req: Request) => extractRefreshCookie(req, configService)]),
      ]),
    };
  },
}) {
  constructor(protected configService: ConfigService<ConfigurationPath>) {
    super(configService);
  }

  async validateUser(user: User, req: Request) {
    const tokenString = extractRefreshCookie(req, this.configService);
    const vid = req.header(Headers.X_VISITOR_ID);
    const refreshTokenModel = user.getRefreshTokenByVisitorId(vid);

    if (!refreshTokenModel) throw new UnauthorizedException();

    const isRefreshTokenMatching = await bcrypt.compare(tokenString, refreshTokenModel.hash);

    if (!isRefreshTokenMatching) throw new UnauthorizedException();
  }
}
