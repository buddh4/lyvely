import {
  UpdateMilestoneModel,
  IMilestonesEndpointService,
  ENDPOINT_MILESTONES,
} from '@lyvely/milestones-interface';
import { EndpointResult } from '@lyvely/common';
import { useApiRepository } from '@lyvely/core-interface';

export default {
  async getAll() {
    return useApiRepository().get<EndpointResult<IMilestonesEndpointService['getAll']>>(
      `${ENDPOINT_MILESTONES}`,
    );
  },

  async getById(mid: string) {
    return useApiRepository().get<EndpointResult<IMilestonesEndpointService['getById']>>(
      `${ENDPOINT_MILESTONES}/${mid}`,
    );
  },

  async create(milestone: UpdateMilestoneModel) {
    return useApiRepository().post<EndpointResult<IMilestonesEndpointService['create']>>(
      `${ENDPOINT_MILESTONES}`,
      milestone,
    );
  },

  async update(milestoneId: string, model: Partial<UpdateMilestoneModel>) {
    return useApiRepository().put<EndpointResult<IMilestonesEndpointService['update']>>(
      `${ENDPOINT_MILESTONES}/${milestoneId}`,
      model,
    );
  },
};
