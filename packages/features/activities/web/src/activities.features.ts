import { ACTIVITIES_MODULE_ID } from '@/activities.constants';
import { createProfileFeature } from '@lyvely/web';

export const ActivitiesFeature = createProfileFeature('activities', ACTIVITIES_MODULE_ID, {
  installable: false,
});
