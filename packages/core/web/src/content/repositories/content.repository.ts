import { ENDPOINT_CONTENT, SetMilestoneModel, useApiRepository } from '@lyvely/interface';

export default {
  setMilestone(cid: string, mid: string) {
    return useApiRepository().post(
      `${ENDPOINT_CONTENT}/${cid}/set-milestone`,
      new SetMilestoneModel({ mid }),
    );
  },

  archive(cid: string) {
    return useApiRepository().post(`${ENDPOINT_CONTENT}/${cid}/archive`);
  },

  unarchive(cid: string) {
    return useApiRepository().post(`${ENDPOINT_CONTENT}/${cid}/unarchive`);
  },
};
