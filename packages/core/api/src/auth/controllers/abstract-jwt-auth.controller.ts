import { addMilliSeconds } from '@lyvely/dates';
import ms from 'ms';
import { LyvelyConfigService } from '@/config';
import {
  getAuthCookieName,
  getRefreshCookieName,
  getRefreshCookieExpiresIn,
  COOKIE_REFRESH_PATH,
} from '../guards';
import { Request } from 'express';
import type { AuthModuleConfig } from '@/core';
import {
  DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
  DEFAULT_SAME_SITE,
  DEFAULT_SECURE_COOKIES,
  MIN_ACCESS_TOKEN_EXPIRES_IN,
} from '@/auth/auth.constants';

export abstract class AbstractJwtAuthController {
  protected constructor(protected configService: LyvelyConfigService<AuthModuleConfig>) {}

  protected setAuthenticationCookie(req: Request, token: string) {
    const secure = this.useSecureCookies();
    const authCookieName = getAuthCookieName(this.configService);
    const expirationMS = Math.max(
      ms(
        this.configService.getModuleConfig(
          'auth',
          'jwt.access.expiresIn',
          DEFAULT_ACCESS_TOKEN_EXPIRES_IN
        )
      ),
      MIN_ACCESS_TOKEN_EXPIRES_IN
    );
    req.res!.cookie(authCookieName, token, {
      sameSite: this.configService.getModuleConfig(
        'auth',
        'jwt.access.sameSite',
        DEFAULT_SAME_SITE
      ),
      httpOnly: true,
      secure: secure,
      expires: addMilliSeconds(new Date(), expirationMS),
    });
  }

  protected setRefreshCookie(req: Request, token: string, remember: boolean) {
    const secure = this.useSecureCookies();
    const refreshCookieName = getRefreshCookieName(this.configService);
    const expiresIn = getRefreshCookieExpiresIn(remember, this.configService);

    req.res!.cookie(refreshCookieName, token, {
      sameSite: this.configService.getModuleConfig(
        'auth',
        'jwt.refresh.sameSite',
        DEFAULT_SAME_SITE
      ),
      httpOnly: true,
      path: COOKIE_REFRESH_PATH,
      secure: secure,
      expires: addMilliSeconds(new Date(), ms(expiresIn!)),
    });
  }

  private useSecureCookies() {
    return this.configService.getModuleConfig('auth', 'jwt.secure-cookies', DEFAULT_SECURE_COOKIES);
  }
}
