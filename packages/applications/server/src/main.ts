import { LyvelyServer } from '@lyvely/api';
import { TasksModule } from '@lyvely/tasks';
import { JournalsModule } from '@lyvely/journals';
import { HabitsModule } from '@lyvely/habits';
import { MilestonesModule } from '@lyvely/milestones';
import { AnalyticsModule } from '@lyvely/analytics';
import { LegalModule } from '@lyvely/legal';

new LyvelyServer().bootstrap({
  modules: [
    TasksModule,
    JournalsModule,
    HabitsModule,
    MilestonesModule,
    LegalModule,
    AnalyticsModule,
  ],
  configFiles: [`../config/lyvely.${process.env.NODE_ENV}.config.ts`],
  serveStatic: false,
});
