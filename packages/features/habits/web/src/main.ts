import 'reflect-metadata';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';
import './index.css';
import { LyvelyWebApp } from '@lyvely/web';

const app = new LyvelyWebApp({
  modules: [],
});

app.init().then(() => app.mount('#app'));
