import { createContentFeature, createProfileFeature } from '@lyvely/interface';
import { HABITS_MODULE_ID } from './habits.constants';

export const HabitsFeature = createContentFeature('habits', HABITS_MODULE_ID);
export const ActivityHabitsFeature = createProfileFeature('habits-activities', HABITS_MODULE_ID, {
  dependencies: [HabitsFeature.id, 'activities'],
});
