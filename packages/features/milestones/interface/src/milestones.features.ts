import { IFeature } from '@lyvely/core-interface';
import { MILESTONES_MODULE_ID } from './milestones.constants';

export const MilestonesFeature: IFeature = {
  id: 'milestones',
  title: 'milestones.feature.title',
  description: 'milestones.feature.description',
  moduleId: MILESTONES_MODULE_ID,
  installable: true,
  configurable: false,
  enabledByDefault: true,
};

export const ActivityMilestonesFeature: IFeature = {
  id: 'milestone-activities',
  title: 'milestones.feature.activities.title',
  description: 'milestones.feature.activities.description',
  moduleId: MILESTONES_MODULE_ID,
  installable: true,
  enabledByDefault: true,
  dependencies: [MilestonesFeature.id, 'activities'],
};
