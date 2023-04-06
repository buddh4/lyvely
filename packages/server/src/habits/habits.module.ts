import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/users';
import { HabitsController } from './controllers';
import { HabitDataPointService, HabitsService, HabitTimeSeriesService } from './services';
import { ContentModule, getContentModelDefinition, getContentScoreDefinition } from '@/content';
import { ProfilesModule } from '@/profiles';
import { PoliciesModule } from '@/policies/policies.module';
import { HabitDataPointDao, HabitsDao } from './daos';
import { CoreModule } from '@/core';
import { getDataPointModelDefinition } from '@/time-series';
import { Habit, HabitSchema, HabitScore, HabitScoreSchema } from './schemas';
import { DataPointValueType } from '@lyvely/common';

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
    HabitsService,
  ],
})
export class HabitsModule {}
