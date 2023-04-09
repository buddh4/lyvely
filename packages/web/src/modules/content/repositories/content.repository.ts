import repository from '@/repository';
import { ENDPOINT_CONTENT, SetMilestoneModel } from '@lyvely/common';

export default {
  setMilestone(cid: string, mid: string) {
    return repository.post(
      `${ENDPOINT_CONTENT}/${cid}/set-milestone`,
      new SetMilestoneModel({ mid }),
    );
  },

  archive(cid: string) {
    return repository.post(`${ENDPOINT_CONTENT}/${cid}/archive`);
  },

  unarchive(cid: string) {
    return repository.post(`${ENDPOINT_CONTENT}/${cid}/unarchive`);
  },
};
