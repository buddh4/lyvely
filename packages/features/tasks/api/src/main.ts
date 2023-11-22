import { LyvelyServer } from '@lyvely/api';
import { TasksModule } from './tasks.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [TasksModule],
});
