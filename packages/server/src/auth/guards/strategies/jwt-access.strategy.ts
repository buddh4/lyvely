import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtStrategy, JwtTokenPayloadIF } from '@/jwt';
import { User } from '@/users';
import { UserStatus } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@lyvely/server-core';

export const JWT_ACCESS_TOKEN = 'jwt-access-token';

const COOKIE_AUTHENTICATION = 'Authentication';
const COOKIE_AUTHENTICATION_HOST = '__Host-Authentication';

export function getAuthCookieName(configService: ConfigService<ConfigurationPath>) {
  const useSecureCookies = configService.get('auth.jwt.secure-cookies', true);
  return useSecureCookies ? COOKIE_AUTHENTICATION_HOST : COOKIE_AUTHENTICATION;
}

export function extractAuthCookie(req: Request, configService: ConfigService<ConfigurationPath>) {
  return req.cookies && req.cookies[getAuthCookieName(configService)];
}

export function clearAccessCookies(res: Response) {
  res.clearCookie(COOKIE_AUTHENTICATION);
  res.clearCookie(COOKIE_AUTHENTICATION_HOST);
}

@Injectable()
export class JwtAccessStrategy extends JwtStrategy<JwtTokenPayloadIF>({
  name: JWT_ACCESS_TOKEN,
  options: (configService) => {
    return {
      secretOrKey: configService.get('auth.jwt.access.secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => extractAuthCookie(req, configService),
      ]),
    };
  },
}) {
  constructor(protected configService: ConfigService<ConfigurationPath>) {
    super(configService);
  }

  override async validateUser(user: User) {
    if (user.status !== UserStatus.Active) throw new UnauthorizedException();
  }
}
