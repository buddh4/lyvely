import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtStrategy, JwtTokenPayloadIF } from '@/jwt';
import { Headers } from '@lyvely/interface';
import { User } from '@/users';
import bcrypt from 'bcrypt';
import { LyvelyConfigService } from '@/config';
import type { AuthModuleConfig } from '@/core';

export const COOKIE_REFRESH = 'Refresh';
// TODO: this should not be hardcoded since the /api path is optional also when using versioning the path differs
export const COOKIE_REFRESH_PATH = '/api/auth/refresh';
export const COOKIE_REFRESH_SECURE = '__Secure-Refresh';
export const JWT_REFRESH_TOKEN = 'jwt-refresh-token';

export interface JwtRefreshTokenPayloadIF extends JwtTokenPayloadIF {
  sub: string;
  remember: boolean;
}

export function getRefreshCookieName(configService: LyvelyConfigService<AuthModuleConfig>) {
  const useSecureCookies = configService.getModuleConfig('auth', 'jwt.secure-cookies', true);
  return useSecureCookies ? COOKIE_REFRESH_SECURE : COOKIE_REFRESH;
}

export function extractRefreshCookie(
  req: Request,
  configService: LyvelyConfigService<AuthModuleConfig>
) {
  return req.cookies && req.cookies[getRefreshCookieName(configService)];
}

export function getRefreshCookieExpiresIn(
  remember: boolean,
  configService: LyvelyConfigService<AuthModuleConfig>
) {
  return remember
    ? configService.getModuleConfigOrThrow('auth', 'jwt.refresh.expiresInRemember')
    : configService.getModuleConfigOrThrow('auth', 'jwt.refresh.expiresIn');
}

export function clearRefreshCookies(res: Response) {
  res.clearCookie(COOKIE_REFRESH);
  res.clearCookie(COOKIE_REFRESH, { path: COOKIE_REFRESH_PATH });
  res.clearCookie(COOKIE_REFRESH_SECURE);
  res.clearCookie(COOKIE_REFRESH_SECURE, { path: COOKIE_REFRESH_PATH });
}

@Injectable()
export class JwtRefreshStrategy extends JwtStrategy<JwtRefreshTokenPayloadIF>({
  name: 'jwt-refresh-token',
  options: (configService: LyvelyConfigService<AuthModuleConfig>) => {
    return {
      secretOrKey: configService.getModuleConfigOrThrow('auth', 'jwt.refresh.secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromExtractors([(req: Request) => extractRefreshCookie(req, configService)]),
      ]),
    };
  },
}) {
  constructor(protected configService: LyvelyConfigService<AuthModuleConfig>) {
    super(configService);
  }

  override async validateUser(user: User, req: Request) {
    const tokenString = extractRefreshCookie(req, this.configService);
    const vid = req.header(Headers.X_VISITOR_ID);

    if (!vid) throw new UnauthorizedException();

    const refreshTokenModel = user.getRefreshTokenByVisitorId(vid);

    if (!refreshTokenModel) throw new UnauthorizedException();

    const isRefreshTokenMatching = await bcrypt.compare(tokenString, refreshTokenModel.hash);

    if (!isRefreshTokenMatching) throw new UnauthorizedException();
  }
}
