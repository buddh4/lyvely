import { LyvelyServer } from './server/lyvely.server';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: [`config/lyvely.${process.env.NODE_ENV}.config.ts`],
});
