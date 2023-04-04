import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/users';
import { HabitsController } from './controllers';
import { HabitsService, HabitDataPointService, HabitTimeSeriesService } from './services';
import { ContentModule, getContentModelDefinition, getContentScoreDefinition } from '@/content';
import { ProfilesModule } from '@/profiles';
import { PoliciesModule } from '@/policies/policies.module';
import { HabitsDao, HabitDataPointDao } from './daos';
import { CoreModule } from '@/core';
import { DataPoint, DataPointSchema } from '@/time-series';
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
      { name: DataPoint.name, collection: 'habitdatapoints', schema: DataPointSchema },
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
