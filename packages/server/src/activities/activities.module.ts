import { Module } from '@nestjs/common';
import { ActivitiesController } from './controllers/activities.controller';
import { ActivitiesService } from './services/activities.service';
import { TasksService } from './services/tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivityDataPointSchema,
  ActivityDataPoint,
  Habit,
  HabitSchema,
  Task,
  TaskSchema, Activity, ActivitySchema,
} from './schemas';
import { CalendarModule } from '../calendar/calendar.module';
import { UsersModule } from '../users/users.module';
import { HabitsController } from './controllers/habits.controller';
import { HabitsService } from './services/habits.service';
import { TasksController } from './controllers/tasks.controller';
import { ActivityDataPointService } from './services/activity-data-point.service';
import { Content } from '../content/schemas/content.schema';
import { ProfilesModule } from '../profiles/profiles.module';
import { ActivitiesDao } from './daos/activities.dao';
import { TasksDao } from './daos/tasks.dao';
import { PoliciesModule } from '../policies/policies.module';
import { ContentModule } from '../content/content.module';
import { HabitsDao } from './daos/habits.dao';
import { ActivityEvents } from './activities.events';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    PoliciesModule,
    ProfilesModule,
    ContentModule,
    CalendarModule,
    MongooseModule.forFeature([
      {
        name: Activity.name,
        collection: Content.collectionName(),
        schema: ActivitySchema,
        discriminators: [
          { name: Habit.name, schema: HabitSchema },
          { name: Task.name, schema: TaskSchema },
        ],
      },
      { name: ActivityDataPoint.name, schema: ActivityDataPointSchema },
    ]),
  ],
  controllers: [ActivitiesController, HabitsController, TasksController],
  providers: [
    ActivityEvents,
    ActivitiesDao,
    TasksDao,
    HabitsDao,
    ActivitiesService,
    ActivityDataPointService,
    HabitsService,
    TasksService
  ],
})
export class ActivitiesModule {}
