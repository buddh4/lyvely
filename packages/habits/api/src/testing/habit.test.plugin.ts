import { TestPlugin } from '@lyvely/testing';
import { HabitTestDataUtil } from './habit.test.utils';
import { getContentModelDefinition, getContentScoreDefinition } from '@lyvely/content';
import { Habit, HabitSchema, HabitScore, HabitScoreSchema } from '../schemas';
import { DataPointValueType, getDataPointModelDefinition } from '@lyvely/time-series';
import { profilesTestPlugin } from '@lyvely/profiles';

export const habitTestPlugin = {
  apply(builder) {
    builder.providers([HabitTestDataUtil]);
    builder
      .models([
        getContentModelDefinition([{ name: Habit.name, schema: HabitSchema }]),
        getDataPointModelDefinition(Habit.name, [
          DataPointValueType.Number,
          DataPointValueType.Timer,
        ]),
        getContentScoreDefinition([{ name: HabitScore.name, schema: HabitScoreSchema }]),
      ])
      .plugins([profilesTestPlugin]);
  },
} as TestPlugin;
