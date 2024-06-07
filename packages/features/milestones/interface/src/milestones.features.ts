import { MILESTONES_MODULE_ID } from './milestones.constants';
import { createContentFeature, createProfileFeature } from '@lyvely/interface';

export const MilestonesFeature = createContentFeature('milestones', MILESTONES_MODULE_ID);

export const ActivityMilestonesFeature = createProfileFeature(
  'milestone-activities',
  MILESTONES_MODULE_ID
);
