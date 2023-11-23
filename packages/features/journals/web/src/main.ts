import 'reflect-metadata';

import './styles/tailwind.css';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import { journalsModule } from './journals.module';

new LyvelyWebApp({
  modules: [journalsModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
