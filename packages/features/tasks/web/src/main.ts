import 'reflect-metadata';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';
import '@lyvely/calendar-plan-web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import tasksModule from './module';

const app = new LyvelyWebApp({
  modules: [tasksModule()],
});

app.init().then(() => app.mount('#app'));
