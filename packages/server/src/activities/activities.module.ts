import { Module } from '@nestjs/common';
import { ActivitiesController } from './controllers/activities.controller';
import { ActivitiesService } from './services/activities.service';
import { TasksService } from './services/tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Habit, HabitSchema, Task, TaskSchema, Activity, ActivitySchema } from './schemas';
import { UsersModule } from '@/users';
import { HabitsController } from './controllers/habits.controller';
import { HabitsService } from './services/habits.service';
import { TasksController } from './controllers/tasks.controller';
import { HabitDataPointService } from './services/habit-data-point.service';
import { ContentModule } from '@/content';
import { ProfilesModule } from '@/profiles';
import { ActivitiesDao } from './daos/activities.dao';
import { TasksDao } from './daos/tasks.dao';
import { PoliciesModule } from '@/policies/policies.module';
import { HabitsDao } from './daos/habits.dao';
import { CoreModule } from '@/core';
import { HabitDataPointDao } from './daos/habit-data-point.dao';
import { DataPoint, DataPointSchema } from '@/time-series';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    PoliciesModule,
    ProfilesModule,
    ContentModule.registerContentType(Habit, Task),
    MongooseModule.forFeature([
      {
        name: Activity.name,
        collection: Activity.collectionName(),
        schema: ActivitySchema,
        discriminators: [
          { name: Habit.name, schema: HabitSchema },
          { name: Task.name, schema: TaskSchema },
        ],
      },
      { name: DataPoint.name, collection: 'habitdatapoints', schema: DataPointSchema },
    ]),
  ],
  controllers: [ActivitiesController, HabitsController, TasksController],
  providers: [
    ActivitiesDao,
    TasksDao,
    HabitsDao,
    HabitDataPointDao,
    ActivitiesService,
    HabitDataPointService,
    HabitsService,
    TasksService,
  ],
})
export class ActivitiesModule {}
