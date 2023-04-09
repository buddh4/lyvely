/* eslint-disable */
import 'vue-router';
import { Router } from 'vue-router';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    withCaptcha?: boolean;
    skipProfileIdParam?: boolean;
  }
}

export declare global {
  interface Window {
    app: any;
    Cypress: any;
  }

  export interface ImportMeta {
    glob: <T = any>(path: string, options?: { eager?: boolean }) => (() => T)[] | T[];
    env: {
      DEV: boolean,
      PROD: boolean,
      BASE_URL: string,
      SSR: false,
      VITE_APP_API_URL: string;
      VITE_APP_ENV: 'development' | 'production';
      VITE_APP_BASEURL: string;
      MODE: 'development' | 'production';
    };
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    i18n?: { module?: string | string[] };
    layout?: string;
    baseName?: string;
    nonProfileView?: boolean;
    title?: () => string;
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}
