import { LyvelyServer, ServerConfiguration } from '@lyvely/core';
import { lyvelyDevConfig } from '@lyvely/configs';
import { HabitsModule } from './habits.module';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [HabitsModule],
});
