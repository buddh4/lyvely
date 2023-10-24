import { IFeature } from '@lyvely/web';
import { JOURNALS_MODULE_ID } from './journals.constants';

export const JournalsFeature: IFeature = {
  id: 'journals',
  moduleId: JOURNALS_MODULE_ID,
  title: 'journals.feature.title',
  installable: true,
};
