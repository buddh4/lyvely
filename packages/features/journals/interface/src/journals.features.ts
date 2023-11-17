import { IFeature } from '@lyvely/core-interface';
import { JOURNALS_MODULE_ID } from './journals.constants';

export const JournalsFeature: IFeature = {
  id: 'journals',
  moduleId: JOURNALS_MODULE_ID,
  title: 'journals.feature.title',
  installable: true,
  enabledByDefault: true,
};
