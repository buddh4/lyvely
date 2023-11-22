import { IFeature } from '@lyvely/interface';
import { HABITS_MODULE_ID } from './habits.constants';

export const HabitsFeature: IFeature = {
  id: 'habits',
  title: 'habits.feature.title',
  description: 'habits.feature.description',
  moduleId: HABITS_MODULE_ID,
  installable: true,
  configurable: false,
  enabledByDefault: true,
};

export const ActivityHabitsFeature: IFeature = {
  id: 'habits-activities',
  title: 'habits.feature.activities.title',
  description: 'habits.feature.activities.description',
  moduleId: HABITS_MODULE_ID,
  installable: true,
  enabledByDefault: true,
  dependencies: [HabitsFeature.id, 'activities'],
};
