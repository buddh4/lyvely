import 'reflect-metadata';
import { LyvelyApp } from '@lyvely/web';
import './style.css';

const app = new LyvelyApp();
app.init().then(() => app.mount('#app'));
