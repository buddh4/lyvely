import {
  ITestPlugin,
  contentITestPlugin,
  getContentModelDefinition,
  getContentScoreDefinition,
  profilesITestPlugin,
} from '@lyvely/api';
import { HabitTestDataUtil } from './habit.test.utils';
import { Habit, HabitSchema, HabitScore, HabitScoreSchema } from '../schemas';
import { DataPointValueType, getDataPointModelDefinition } from '@lyvely/time-series';

export const habitITestPlugin = {
  apply(builder) {
    builder
      .plugins([contentITestPlugin, profilesITestPlugin])
      .providers([HabitTestDataUtil])
      .models([
        getContentModelDefinition([{ name: Habit.name, schema: HabitSchema }]),
        getDataPointModelDefinition(Habit.name, [
          DataPointValueType.Number,
          DataPointValueType.Timer,
        ]),
        getContentScoreDefinition([{ name: HabitScore.name, schema: HabitScoreSchema }]),
      ]);
  },
} as ITestPlugin;
