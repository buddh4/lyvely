import { ILegalClient, ENDPOINT_LEGAL } from './legal.endpoint';
import { useApi, IProfileApiRequestOptions } from '@lyvely/interface';

const api = useApi<ILegalClient>(ENDPOINT_LEGAL);

export default {
  async getSectionDetails(sectionId: string, options?: IProfileApiRequestOptions) {
    return api.get<'getLegalDetails'>(sectionId, options);
  },
};
