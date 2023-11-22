import { LyvelyServer } from '@lyvely/core';
import { TasksModule } from '@lyvely/tasks';
import { JournalsModule } from '@lyvely/journals';
import { HabitsModule } from '@lyvely/habits';
import { MilestonesModule } from '@lyvely/milestones';
import { LegalModule } from '@lyvely/legal';

new LyvelyServer().bootstrap({
  modules: [TasksModule, JournalsModule, HabitsModule, MilestonesModule, LegalModule],
  configFiles: [`../config/lyvely.${process.env.NODE_ENV}.config.ts`],
  serveStatic: false,
});
