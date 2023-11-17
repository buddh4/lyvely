import 'reflect-metadata';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';
import '@lyvely/calendar-plan-web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import journalsModule from './module';

const app = new LyvelyWebApp({
  modules: [journalsModule()],
});

app.init().then(() => app.mount('#app'));
