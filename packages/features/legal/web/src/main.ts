import 'reflect-metadata';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import legalModule from './module';

new LyvelyWebApp({
  modules: [legalModule()],
}).init('#app');
