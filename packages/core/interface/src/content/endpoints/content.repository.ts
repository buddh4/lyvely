import { SetMilestoneModel } from '../models';
import { ENDPOINT_CONTENT, ContentEndpointPaths, IContentClient } from './content.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IContentClient>(ENDPOINT_CONTENT);

export default {
  setMilestone(cid: string, mid: string, options?: IProfileApiRequestOptions) {
    return api.post<'setMilestone'>(
      ContentEndpointPaths.SET_MILESTONE(cid),
      new SetMilestoneModel({ mid }),
      options,
    );
  },

  archive(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'archive'>(ContentEndpointPaths.ARCHIVE(cid), {}, options);
  },

  restore(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'restore'>(ContentEndpointPaths.RESTORE(cid), {}, options);
  },
};
