import { LyvelyServer } from './lyvely.server';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: ['config/lyvely.dev.config.ts'],
});
