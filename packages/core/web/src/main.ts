import 'reflect-metadata';
import './styles/tailwind.css';

import { LyvelyWebApp } from '@/lyvely-web.app';

new LyvelyWebApp({
  modules: [],
})
  .init('#app')
  .catch((err) => console.error(err));
