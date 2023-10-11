import { repository } from '@lyvely/web';
import {
  UpdateMilestoneModel,
  IMilestonesEndpointService,
  ENDPOINT_MILESTONES,
} from '@lyvely/milestones-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async getAll() {
    return repository.get<EndpointResult<IMilestonesEndpointService['getAll']>>(
      `${ENDPOINT_MILESTONES}`,
    );
  },

  async getById(mid: string) {
    return repository.get<EndpointResult<IMilestonesEndpointService['getById']>>(
      `${ENDPOINT_MILESTONES}/${mid}`,
    );
  },

  async create(milestone: UpdateMilestoneModel) {
    return repository.post<EndpointResult<IMilestonesEndpointService['create']>>(
      `${ENDPOINT_MILESTONES}`,
      milestone,
    );
  },

  async update(milestoneId: string, model: Partial<UpdateMilestoneModel>) {
    return repository.put<EndpointResult<IMilestonesEndpointService['update']>>(
      `${ENDPOINT_MILESTONES}/${milestoneId}`,
      model,
    );
  },
};
