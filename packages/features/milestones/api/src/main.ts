import { LyvelyServer } from '@lyvely/core';
import { MilestonesModule } from './milestones.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [MilestonesModule],
});
