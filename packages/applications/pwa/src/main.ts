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
import { getInjectedEnv } from '@/pwa.helper';

new LyvelyWebApp({
  baseUrl: getInjectedEnv(
    '{{LYVELY_APP_BASEURL}}',
    import.meta.env.VITE_APP_BASEURL || 'http://127.0.0.1:3000',
  ),
  apiUrl: getInjectedEnv(
    '{{LYVELY_API_URL}}',
    import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8080/api',
  ),
  env: getInjectedEnv('{{LYVELY_APP_ENV}}', import.meta.env.VITE_APP_ENV || 'production'),
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
