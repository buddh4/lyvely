import { Module } from '@nestjs/common';
import { ActivitiesController } from './controllers/activities.controller';
import { ActivitiesService } from './services/activities.service';
import { TasksService } from './services/tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivityDataPointSchema,
  HabitDataPoint,
  Habit,
  HabitSchema,
  Task,
  TaskSchema, Activity, ActivitySchema,
} from './schemas';
import { CalendarModule } from '../calendar/calendar.module';
import { UsersModule } from '../users';
import { HabitsController } from './controllers/habits.controller';
import { HabitsService } from './services/habits.service';
import { TasksController } from './controllers/tasks.controller';
import { HabitDataPointService } from './services/habit-data-point.service';
import { Content, ContentModule } from '../content';
import { ProfilesModule } from '../profiles';
import { ActivitiesDao } from './daos/activities.dao';
import { TasksDao } from './daos/tasks.dao';
import { PoliciesModule } from '../policies/policies.module';
import { HabitsDao } from './daos/habits.dao';
import { ActivityEvents } from './activities.events';
import { CoreModule } from '../core/core.module';
import { HabitDataPointDao } from "./daos/habit-data-point.dao";

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
      { name: HabitDataPoint.name, schema: ActivityDataPointSchema },
    ]),
  ],
  controllers: [ActivitiesController, HabitsController, TasksController],
  providers: [
    ActivityEvents,
    ActivitiesDao,
    TasksDao,
    HabitsDao,
    HabitDataPointDao,
    ActivitiesService,
    HabitDataPointService,
    HabitsService,
    TasksService
  ],
})
export class ActivitiesModule {}
