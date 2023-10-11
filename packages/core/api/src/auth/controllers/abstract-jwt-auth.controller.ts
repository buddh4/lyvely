import { addMilliSeconds } from '@lyvely/dates';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { ConfigurationPath } from '@/core';
import { getAuthCookieName, getRefreshCookieName, getRefreshCookieExpiresIn } from '../guards';
import { Request } from 'express';

const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '15m';
const MIN_ACCESS_TOKEN_EXPIRES_IN = 20_000;
const DEFAULT_SAME_SITE = 'lax';
const DEFAULT_SECURE_COOKIES = true;

export abstract class AbstractJwtAuthController {
  protected constructor(protected configService: ConfigService<ConfigurationPath>) {}

  protected setAuthenticationCookie(req: Request, token: string) {
    const secure = this.useSecureCookies();
    const authCookieName = getAuthCookieName(this.configService);
    const expirationMS = Math.max(
      ms(
        this.configService.get<string>(
          'auth.jwt.access.expiresIn',
          DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
        ),
      ),
      MIN_ACCESS_TOKEN_EXPIRES_IN,
    );
    req.res!.cookie(authCookieName, token, {
      sameSite: this.configService.get('auth.jwt.access.sameSite', DEFAULT_SAME_SITE),
      httpOnly: true,
      secure: secure,
      expires: addMilliSeconds(new Date(), expirationMS, false),
    });
  }

  protected setRefreshCookie(req: Request, token: string, remember: boolean) {
    const secure = this.useSecureCookies();
    const refreshCookieName = getRefreshCookieName(this.configService);
    const expiresIn = getRefreshCookieExpiresIn(remember, this.configService);

    req.res!.cookie(refreshCookieName, token, {
      sameSite: this.configService.get('auth.jwt.refresh.sameSite', DEFAULT_SAME_SITE),
      httpOnly: true,
      path: '/api/auth/refresh',
      secure: secure,
      expires: addMilliSeconds(new Date(), ms(expiresIn!), false),
    });
  }

  private useSecureCookies() {
    return this.configService.get('auth.jwt.secure-cookies', DEFAULT_SECURE_COOKIES);
  }
}
