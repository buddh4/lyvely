import { LyvelyServer } from '@lyvely/api';
import { MilestonesModule } from './milestones.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [MilestonesModule],
});
