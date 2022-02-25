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
    env: {
      VITE_APP_API_URL: string;
      BASE_URL: string;
      NODE_ENV: 'development' | 'production';
      MONGOOSE_DEBUG: boolean;
      PORT?: string;
      PWD: string;
      MODE: 'development' | 'production';
    }
  }
}
