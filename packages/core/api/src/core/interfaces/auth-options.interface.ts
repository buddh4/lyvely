import type { CookieSameSite } from './cookie-same-site.interface';
import type { ModuleConfig } from './server-configuration.interface';

export type AuthModuleConfig = ModuleConfig<'auth', LyvelyAuthOptions>;

export type LyvelyAuthOptions = {
  jwt: {
    'secure-cookies': boolean;
    issuer?: string;
    access: {
      secret: string;
      expiresIn: string;
      sameSite: CookieSameSite;
    };
    refresh: {
      secret: string;
      expiresIn: string;
      expiresInRemember: string;
      sameSite: CookieSameSite;
    };
    verify: {
      secret: string;
      expiresIn: string;
    };
  };
};
