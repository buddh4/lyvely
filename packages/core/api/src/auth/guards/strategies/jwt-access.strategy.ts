import { ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtStrategy, JwtTokenPayloadIF } from '@/jwt';
import { LyvelyConfigService } from '@/config';
import type { AuthModuleConfig } from '@/core';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
/// <reference types="@types/qs" />
/// <reference types="@types/express-serve-static-core" />

export const JWT_ACCESS_TOKEN = 'jwt-access-token';

const COOKIE_AUTHENTICATION = 'Authentication';
const COOKIE_AUTHENTICATION_HOST = '__Host-Authentication';

export function getAuthCookieName(configService: LyvelyConfigService<AuthModuleConfig>) {
  const useSecureCookies = configService.getModuleConfig('auth', 'jwt.secure-cookies', true);
  return useSecureCookies ? COOKIE_AUTHENTICATION_HOST : COOKIE_AUTHENTICATION;
}

export function extractAuthCookie(
  req: Request,
  configService: LyvelyConfigService<AuthModuleConfig>
) {
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
      secretOrKey: configService.getModuleConfigOrThrow('auth', 'jwt.access.secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => extractAuthCookie(req, configService),
      ]),
    };
  },
}) {
  constructor(protected configService: LyvelyConfigService<AuthModuleConfig>) {
    super(configService);
  }

  override async validateUser() {
    // By default, all users are valid, user status etc. should be validated in another guard.
    return true;
  }
}
