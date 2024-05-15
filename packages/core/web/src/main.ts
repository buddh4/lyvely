import 'reflect-metadata';
import './styles/tailwind.css';
import './styles/index.css';
import '@lyvely/ui/style.css';

import { LyvelyWebApp } from '@/lyvely-web.app';

new LyvelyWebApp({
  modules: [],
})
  .init('#app')
  .catch((err) => console.error(err));
