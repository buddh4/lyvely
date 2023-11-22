import { IWebConfig } from '@/web-config';

export default {
  apiUrl: 'http://localhost:8080/api',
  baseUrl: import.meta.env.BASE_URL,
  moduleImports: [
    //import.meta.glob<IModuleImport>('../../../features/**/web/src/module.ts'),
    // import('../../../features/journals/web/src/module'),
  ],
} as IWebConfig;
