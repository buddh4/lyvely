import { LyvelyServer } from '@lyvely/api';
import { HabitsModule } from './habits.module';
import { getDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: getDevConfig(),
  modules: [HabitsModule],
});
