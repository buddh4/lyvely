import { ILegalClient, ENDPOINT_LEGAL } from './legal.endpoint';
import { useApi } from '@lyvely/interface';

const api = useApi<ILegalClient>(ENDPOINT_LEGAL);

export default {
  async getSectionDetails(sectionId: string) {
    return api.get<'getLegalDetails'>(sectionId);
  },
};
