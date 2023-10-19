import { IFeature } from '@lyvely/core-interface';
import { HABIT_MODULE_ID } from './habits.constants';

export const HabitsFeature: IFeature = {
  id: 'habits',
  title: 'habits.feature.title',
  description: 'habits.feature.description',
  moduleId: HABIT_MODULE_ID,
  installable: true,
  configurable: true,
  enabledByDefault: true,
};
