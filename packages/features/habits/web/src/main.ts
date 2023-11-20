import 'reflect-metadata';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import habitsModule from './module';

const app = new LyvelyWebApp({
  modules: [habitsModule()],
});

app.init().then(() => app.mount('#app'));
