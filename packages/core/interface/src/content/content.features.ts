import { type IProfileFeature } from '@/features';
import { CONTENT_MODULE_ID } from '@/content/content.constants';
import { createProfileFeature } from '@/profiles';

export const ContentStreamFeature: IProfileFeature = createProfileFeature(
  'content-stream',
  CONTENT_MODULE_ID
);
