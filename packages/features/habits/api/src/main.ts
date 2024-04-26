import { LyvelyServer } from '@lyvely/api';
import { HabitsModule } from './habits.module';
import { getDevConfig } from '@lyvely/devtools';
import { AnalyticsModule } from '@lyvely/analytics';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: getDevConfig(),
  modules: [HabitsModule, AnalyticsModule],
});
