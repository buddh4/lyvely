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
  ContentModule,
  getContentModelDefinition,
  getContentScoreDefinition,
  ProfilesModule,
  LyvelyModule,
} from '@lyvely/api';
import { HabitDataPointDao, HabitsDao } from './daos';
import { getDataPointModelDefinition, DataPointValueType } from '@lyvely/time-series';
import { Habit, HabitSchema, HabitScore, HabitScoreSchema } from './schemas';
import { ActivityHabitsFeature, HABITS_MODULE_ID, HabitsFeature } from '@lyvely/habits-interface';

@LyvelyModule({
  id: HABITS_MODULE_ID,
  name: 'Habits',
  path: __dirname,
  features: [HabitsFeature, ActivityHabitsFeature],
  permissions: HabitPermissions,
  imports: [
    UsersModule,
    ProfilesModule,
    ContentModule.registerContentType(Habit),
    ProfilesModule.registerProfileScoreType(HabitScore),
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
