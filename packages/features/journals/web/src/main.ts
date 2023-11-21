import 'reflect-metadata';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';
import '@lyvely/calendar-plan-web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import journalsModule from './module';

new LyvelyWebApp({
  modules: [journalsModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
