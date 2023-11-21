import 'reflect-metadata';
import './index.css';

import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';
import '@lyvely/calendar-plan-web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import { habitsModule } from '@lyvely/habits-web';
import { tasksModule } from '@lyvely/tasks-web';
import { milestonesModule } from '@lyvely/milestones-web';
import activitiesModule from './module';

new LyvelyWebApp({
  modules: [activitiesModule(), habitsModule(), tasksModule(), milestonesModule()],
})
  .init('#app')
  .catch((err) => console.error(err));
