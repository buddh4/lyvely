import 'reflect-metadata';
import '@lyvely/ui/style.css';
import '@lyvely/web/style.css';
import './styles/index.css';
import { LyvelyWebApp } from '@lyvely/web';
import { tasksModule } from '@lyvely/tasks-web';
import { activitiesModule } from '@lyvely/activities-web';
import { habitsModule } from '@lyvely/habits-web';
import { milestonesModule } from '@lyvely/milestones-web';
import { legalModule } from '@lyvely/legal-web';
import { registerSW } from 'virtual:pwa-register';

const app = new LyvelyWebApp({
  modules: [activitiesModule(), tasksModule(), habitsModule(), milestonesModule(), legalModule()],
  // import: () => import.meta.glob<Promise<IModuleImport>>('../../../features/**/web/module.ts'),
});

app.init().then(() => app.mount('#app'));

const updateSW = registerSW({
  onNeedRefresh() {
    app.events.emit('app.need.refresh', updateSW);
  },
  onOfflineReady() {
    app.events.emit('app.offline.ready');
  },
});
