/* eslint-disable */
import 'vue-router';
import {Router} from "vue-router";
import { Module } from "@server/modules/core/modules/interfaces/module.interface";

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

export declare global {
  interface Window {
    app: any;
    Cypress: any
  }

  export interface ImportMeta {
    glob: <T = any> (path: string, options?: { eager?: boolean }) => (() => T)[]|T[],
    env: {
      VITE_APP_API_URL: string;
      VITE_APP_ENV: 'development' | 'production';
      VITE_APP_BASEURL: string;
      MODE: 'development' | 'production';
    }
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    i18n?: { module?: string }
    layout?: string
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router
  }
}
