import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@lyvely/users';
import { HabitsController } from './controllers';
import { HabitDataPointService, HabitsService, HabitTimeSeriesService } from './services';
import { ContentModule, getContentModelDefinition, getContentScoreDefinition } from '@lyvely/content';
import { ProfilesModule } from '@lyvely/profiles';
import { PoliciesModule } from '@lyvely/policies/policies.module';
import { HabitDataPointDao, HabitsDao } from './daos';
import { CoreModule } from '@lyvely/core';
import { getDataPointModelDefinition } from '@lyvely/time-series';
import { Habit, HabitSchema, HabitScore, HabitScoreSchema } from './schemas';
import { DataPointValueType } from '@lyvely/common';
import { HabitDataPointTimerService } from '../services';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    PoliciesModule,
    ProfilesModule,
    ContentModule.registerContentType(Habit),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Habit.name, schema: HabitSchema }]),
      getContentScoreDefinition([{ name: HabitScore.name, schema: HabitScoreSchema }]),
      getDataPointModelDefinition(Habit.name, [
        DataPointValueType.Number,
        DataPointValueType.Timer,
      ]),
    ]),
  ],
  controllers: [HabitsController],
  providers: [
    HabitsDao,
    HabitDataPointDao,
    HabitDataPointService,
    HabitTimeSeriesService,
    HabitDataPointTimerService,
    HabitsService,
  ],
})
export class HabitsModule {}