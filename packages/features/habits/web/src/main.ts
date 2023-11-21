import 'reflect-metadata';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import habitsModule from './module';

new LyvelyWebApp({
  modules: [habitsModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
