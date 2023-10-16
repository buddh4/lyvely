import { IFeature } from '@lyvely/web';
import { ACTIVITIES_MODULE_ID } from '@/activities.constants';

export const ActivitiesFeatures: IFeature = {
  id: 'activities',
  moduleId: ACTIVITIES_MODULE_ID,
  installable: true,
  title: 'activities.feature.title',
  description: 'activities.feature.description',
  configurable: true,
  enabledByDefault: true,
};
