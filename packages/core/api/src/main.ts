import { LyvelyServer } from './lyvely.server';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: ['lyvely-dev.config.ts'],
});
