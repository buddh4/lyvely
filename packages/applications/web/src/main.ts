import 'reflect-metadata';
import '@lyvely/ui/style.css';
import { LyvelyWebApp } from '@lyvely/web';
import { registerSW } from 'virtual:pwa-register';

const app = new LyvelyWebApp({
  // import: () => import.meta.glob<Promise<IModuleImport>>('../../../features/**/web/module.ts'),
});

app.init().then(() => app.mount('#app'));

const updateSW = registerSW({
  onNeedRefresh() {
    app.events.emit('app.need.refresh', updateSW);
  },
  onOfflineReady() {
    app.events.emit('app.offline.ready');
  },
});
