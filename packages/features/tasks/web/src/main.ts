import 'reflect-metadata';
import './styles/tailwind.css';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import tasksModule from './module';

new LyvelyWebApp({
  modules: [tasksModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
