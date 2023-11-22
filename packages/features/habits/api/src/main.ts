import { LyvelyServer } from '@lyvely/api';
import { HabitsModule } from './habits.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [HabitsModule],
});
