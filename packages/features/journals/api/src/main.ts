import { LyvelyServer } from '@lyvely/api';
import { JournalsModule } from './journals.module';
import { lyvelyDevConfig } from '@lyvely/devtools';
import { AnalyticsModule } from '@lyvely/analytics';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [JournalsModule, AnalyticsModule],
});
