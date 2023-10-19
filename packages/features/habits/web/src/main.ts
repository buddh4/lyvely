import 'reflect-metadata';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';
import '@lyvely/calendar-plan-web/style.css';
import './index.css';
import { LyvelyWebApp } from '@lyvely/web';
import habitsModule from './module';
import { activitiesModule } from '@lyvely/activities-web';

const app = new LyvelyWebApp({
  modules: [habitsModule(), activitiesModule()],
});

app.init().then(() => app.mount('#app'));
