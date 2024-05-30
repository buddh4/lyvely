/* eslint-disable */
import 'vue-router';
import { Router } from 'vue-router';
import { ProfileRelationRole, ProfileVisibilityLevel } from '@lyvely/interface';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    withCaptcha?: boolean;
  }
}

export declare global {
  interface Window {
    app: any;
    Cypress: any;
  }

  interface ImportMetaOptions {
    eager?: boolean;
  }

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
      VITE_FALLBACK_LOCALE: string;
      VITE_APP_ENV: 'development' | 'production';
      VITE_APP_BASEURL: string;
    };
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    i18n?: { load?: Array<{ module: string; section?: string } | string> };
    layout?: string;
    showMobileFooter?: boolean;
    baseName?: string;
    visibility?: ProfileVisibilityLevel;
    role?: ProfileRelationRole;
    isPublic?: boolean;
    title?: () => string;
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}
