/* eslint-disable */
import 'vue-router';

export declare global {
  export interface ImportMeta {
    glob<T = any>(path: string, options: { eager: true }): Record<string, T>;
    glob<T = any, TOptions extends ImportMetaOptions = ImportMetaOptions>(
      path: string,
      options?: TOptions
    ): Record<string, Promise<T>>;
    env: {
      DEV: boolean;
      PROD: boolean;
      BASE_URL: string;
      SSR: false;
      VITE_APP_API_URL: string;
      VITE_APP_ENV: 'development' | 'production';
      VITE_APP_BASEURL: string;
    };
  }
}
