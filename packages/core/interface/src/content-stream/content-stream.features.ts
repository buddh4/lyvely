import { IFeature } from '@/features';
import { CONTENT_STREAM_MODULE_ID } from './content-stream.constants';

export const ContentStreamFeature: IFeature = {
  id: 'content-stream',
  moduleId: CONTENT_STREAM_MODULE_ID,
  title: 'content-stream.feature.title',
  enabledByDefault: true,
  installable: false,
};
