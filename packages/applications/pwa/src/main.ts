import 'reflect-metadata';
import './styles/tailwind.css';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';

import { LyvelyWebApp } from '@lyvely/web';
import { tasksModule } from '@lyvely/tasks-web';
import { activitiesModule } from '@lyvely/activities-web';
import pwaModule from './module';
import { habitsModule } from '@lyvely/habits-web';
import { milestonesModule } from '@lyvely/milestones-web';
import { legalModule } from '@lyvely/legal-web';
import { registerSW } from 'virtual:pwa-register';
import { analyticsModule } from '@lyvely/analytics-web';

new LyvelyWebApp({
  modules: [
    activitiesModule(),
    tasksModule(),
    habitsModule(),
    analyticsModule(),
    pwaModule(),
    milestonesModule(),
    legalModule(),
  ],
})
  .init('#app')
  .then((app) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        app.events.emit('app.need.refresh', updateSW);
      },
      onOfflineReady() {
        app.events.emit('app.offline.ready');
      },
    });
  })
  .catch((err) => console.error(err));
