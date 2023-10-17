import { IFeature } from '@/features';
import { CONTENT_MODULE_ID } from '@/content/content.constants';

export const ContentStreamFeature: IFeature = {
  id: 'content.stream',
  moduleId: CONTENT_MODULE_ID,
  title: 'content.stream.feature.title',
  enabledByDefault: true,
  installable: true,
};
