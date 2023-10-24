import { IFeature } from '@lyvely/web';
import { ACTIVITIES_MODULE_ID } from '@/activities.constants';

export const ActivitiesFeature: IFeature = {
  id: 'activities',
  title: 'activities.feature',
  moduleId: ACTIVITIES_MODULE_ID,
  installable: false,
  enabledByDefault: true,
};
