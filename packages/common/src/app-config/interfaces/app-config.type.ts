export type AppConfig = {
  appName: string;
  docUrl: string;
  csrf_token: string;
  locales: ILocale[];
  registrationMode: RegistrationMode;
} & { [n: string]: any };

export type RegistrationMode = 'public' | 'invite' | 'none';

export interface ILocale {
  locale: string;
  name: string;
}
