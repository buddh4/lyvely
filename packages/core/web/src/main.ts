import 'reflect-metadata';
import '@lyvely/ui/style.css';
import { LyvelyWebApp } from '@/lyvely-web.app';

const app = new LyvelyWebApp({
  modules: [],
});

app.init().then(() => app.mount('#app'));
