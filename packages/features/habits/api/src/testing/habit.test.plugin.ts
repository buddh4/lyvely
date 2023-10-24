import { TestPlugin } from '@lyvely/testing';
import { HabitTestDataUtil } from './habit.test.utils';
import {
  contentTestPlugin,
  getContentModelDefinition,
  getContentScoreDefinition,
  profilesTestPlugin,
} from '@lyvely/core';
import { Habit, HabitSchema, HabitScore, HabitScoreSchema } from '../schemas';
import { DataPointValueType, getDataPointModelDefinition } from '@lyvely/time-series';

export const habitTestPlugin = {
  apply(builder) {
    builder
      .plugins([contentTestPlugin, profilesTestPlugin])
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
} as TestPlugin;
