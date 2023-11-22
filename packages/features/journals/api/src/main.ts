import { LyvelyServer } from '@lyvely/core';
import { JournalsModule } from './journals.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [JournalsModule],
});
