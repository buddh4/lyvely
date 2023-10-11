import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsController } from './controllers';
import {
  HabitDataPointService,
  HabitsService,
  HabitTimeSeriesService,
  HabitDataPointTimerService,
} from './services';
import {
  UsersModule,
  CoreModule,
  ContentModule,
  getContentModelDefinition,
  getContentScoreDefinition,
  PoliciesModule,
  ProfilesModule,
} from '@lyvely/core';
import { HabitDataPointDao, HabitsDao } from './daos';
import { getDataPointModelDefinition, DataPointValueType } from '@lyvely/time-series';
import { Habit, HabitSchema, HabitScore, HabitScoreSchema } from './schemas';

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
