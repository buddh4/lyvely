export type AppConfig = {
  csrf_token: string;
  locales: [{ locale: string; name: string }];
} & { [n: string]: any };
