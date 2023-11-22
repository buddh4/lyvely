import { LyvelyServer } from '@lyvely/core';
import { LegalModule } from './legal.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [LegalModule],
});
