import { LyvelyServer } from '@lyvely/core';
import { HabitsModule } from './habits.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [HabitsModule],
});
