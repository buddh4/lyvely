import 'reflect-metadata';

import './styles/tailwind.css';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import habitsModule from './module';
import { analyticsModule } from '@lyvely/analytics-web';

new LyvelyWebApp({
  modules: [habitsModule(), analyticsModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
