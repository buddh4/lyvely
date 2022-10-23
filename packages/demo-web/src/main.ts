import 'reflect-metadata';
import { LyvelyApp } from '@lyvely/web';
import './style.css';

const app = new LyvelyApp();
await app.init();
app.mount('#app');
