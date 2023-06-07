import { LegalSection } from '@/legal';

export type AppConfig = {
  appName: string;
  docUrl: string;
  csrf_token: string;
  locales: ILocale[];
  legal: LegalSection[];
  registrationMode: RegistrationMode;
} & { [n: string]: any };

export type RegistrationMode = 'public' | 'invite' | 'none';

export interface ILocale {
  locale: string;
  name: string;
}
