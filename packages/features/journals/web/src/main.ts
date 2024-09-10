import 'reflect-metadata';

import './styles/tailwind.css';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import { journalsModule } from './journals.module';
import { analyticsModule } from '@lyvely/analytics-web';

new LyvelyWebApp({
  apiUrl: 'http://127.0.0.1:8080/api',
  modules: [journalsModule(), analyticsModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
