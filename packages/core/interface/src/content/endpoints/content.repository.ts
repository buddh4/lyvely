import { SetMilestoneModel } from '../models';
import { ENDPOINT_CONTENT, ContentEndpointPaths, IContentClient } from './content.endpoint';
import { useApi } from '@/repository';

const api = useApi<IContentClient>(ENDPOINT_CONTENT);

export default {
  setMilestone(cid: string, mid: string) {
    return api.post<'setMilestone'>(
      ContentEndpointPaths.SET_MILESTONE(cid),
      new SetMilestoneModel({ mid }),
    );
  },

  archive(cid: string) {
    return api.post<'archive'>(ContentEndpointPaths.ARCHIVE(cid));
  },

  restore(cid: string) {
    return api.post<'restore'>(ContentEndpointPaths.RESTORE(cid));
  },
};
