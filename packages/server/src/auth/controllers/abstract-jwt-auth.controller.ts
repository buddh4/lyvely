import { addMilliSeconds } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { ConfigurationPath } from '@/core';
import { getAuthCookieName, getRefreshCookieName, getRefreshCookieExpiresIn } from '@/auth/guards/strategies';
import { Request } from 'express';

export abstract class AbstractJwtAuthController {
  constructor(protected configService: ConfigService<ConfigurationPath>) {}

  protected setAuthenticationCookie(req: Request, token: string) {
    const secure = this.useSecureCookies();
    const authCookieName = getAuthCookieName(this.configService);
    const expirationMS = Math.max(ms(this.configService.get<string>('auth.jwt.access.expiresIn', '15m')), 20_000);
    req.res.cookie(authCookieName, token, {
      sameSite: this.configService.get('auth.jwt.access.samesite', 'lax'),
      httpOnly: true,
      secure: secure,
      expires: addMilliSeconds(new Date(), expirationMS, false),
    });
  }

  protected setRefreshCookie(req: Request, token: string, remember: boolean) {
    const secure = this.useSecureCookies();
    const refreshCookieName = getRefreshCookieName(this.configService);
    const expiresIn = getRefreshCookieExpiresIn(remember, this.configService);

    req.res.cookie(refreshCookieName, token, {
      sameSite: this.configService.get('auth.jwt.refresh.samesite', 'lax'),
      httpOnly: true,
      // TODO: (api version) we need to respect api version or different api path here...
      path: '/auth/refresh',
      secure: secure,
      expires: addMilliSeconds(new Date(), ms(expiresIn), false),
    });
  }

  private useSecureCookies() {
    return this.configService.get('auth.jwt.secure-cookies', true);
  }
}
