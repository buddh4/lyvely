import 'reflect-metadata';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import milestonesModule from './module';

new LyvelyWebApp({
  modules: [milestonesModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
