import { addMilliSeconds } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { ConfigurationPath } from '@/modules/core';
import { getAuthCookieName, getRefreshCookieName } from '@/modules/auth/guards/strategies';
import { Request } from 'express';

export abstract class AbstractAuthController {
  constructor(protected configService: ConfigService<ConfigurationPath>) {}

  protected setAuthenticationCookie(req: Request, token: string) {
    const secure = this.useSecureCookies();
    const authCookieName = getAuthCookieName(this.configService);
    const expirationMS = Math.max(ms(this.configService.get('auth.jwt.access.expiresIn', '15m')), 20_000);
    req.res.cookie(authCookieName, token, {
      sameSite: this.configService.get('auth.jwt.access.samesite', 'lax'),
      httpOnly: true,
      secure: secure,
      expires: addMilliSeconds(new Date(), expirationMS, false),
    });
  }

  protected setRefreshCookie(req: Request, token: string) {
    const secure = this.useSecureCookies();
    const refreshCookieName = getRefreshCookieName(this.configService);
    req.res.cookie(refreshCookieName, token, {
      sameSite: this.configService.get('auth.jwt.refresh.samesite', 'lax'),
      httpOnly: true,
      // TODO: we need to respect api version or different api path here...
      path: '/auth/refresh',
      secure: secure,
      expires: addMilliSeconds(new Date(), ms(this.configService.get('auth.jwt.refresh.expiresIn')), false),
    });
  }

  private useSecureCookies() {
    return this.configService.get('auth.jwt.secure-cookies', true);
  }
}
