import './styles/index.css';
import 'reflect-metadata';
import 'animate.css/animate.css';

import { LyvelyWebApp } from '@/lyvely-web.app';

const app = new LyvelyWebApp({
  modules: [],
});

app.init().then(() => app.mount('#app'));
