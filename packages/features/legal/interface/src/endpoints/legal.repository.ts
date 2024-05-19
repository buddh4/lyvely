import { ILegalClient, ENDPOINT_LEGAL } from './legal.endpoint';
import { useApi, IProfileApiRequestOptions } from '@lyvely/interface';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<ILegalClient>(ENDPOINT_LEGAL);

export default {
  async getSectionDetails(sectionId: string, options?: IProfileApiRequestOptions) {
    return api.get<'getLegalDetails'>(sectionId, options);
  },
};
