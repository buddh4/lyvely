import { LyvelyServer } from '@lyvely/api';
import { AnalyticsModule } from './analytics.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [AnalyticsModule],
});
