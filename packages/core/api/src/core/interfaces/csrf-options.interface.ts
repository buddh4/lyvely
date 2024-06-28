import type { CookieSameSite } from './cookie-same-site.interface';

export interface ICsrfOptions {
  enabled?: boolean;
  name?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: CookieSameSite;
}
