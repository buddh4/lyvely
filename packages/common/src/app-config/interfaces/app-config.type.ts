export type AppConfig = {
  appName: string;
  docUrl: string;
  csrf_token: string;
  locales: ILocale[];
} & { [n: string]: any };

export interface ILocale {
  locale: string;
  name: string;
}
