import 'reflect-metadata';
import '@lyvely/ui/style.css';
import { LyvelyWebApp } from '@/lyvely-web.app';

const app = new LyvelyWebApp({
  // import: () => import.meta.glob<Promise<IModuleImport>>('../../../features/**/web/module.ts'),
});

app.init().then(() => app.mount('#app'));
