import 'reflect-metadata';
import '@lyvely/ui/style.css';
import { LyvelyApp } from '@/lyvely.app';
import AppComponent from '@/App.vue';
import { createApp } from 'vue';
import { registerSW } from 'virtual:pwa-register';
import { createLyvelyUi } from '@lyvely/ui';

const app = new LyvelyApp();
app.init().then(() => app.mount('#app'));

const updateSW = registerSW({
  onNeedRefresh() {
    app.events.emit('app.need.refresh', updateSW);
  },
  onOfflineReady() {
    app.events.emit('app.offline.ready');
  },
});

function justForWebstorm() {
  const vueApp = createApp(AppComponent);
  vueApp.use(createLyvelyUi());
}
