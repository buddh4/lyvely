import repository from '@/repository';
import {
  UpdateMilestoneModel,
  EndpointResult,
  IMilestonesEndpointService,
  CalendarPlanFilter,
  ENDPOINT_MILESTONES,
  CalendarPlanSort,
} from '@lyvely/common';

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return repository.get<EndpointResult<IMilestonesEndpointService['getByFilter']>>(
      ENDPOINT_MILESTONES,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return repository.post<EndpointResult<IMilestonesEndpointService['sort']>>(
      `${ENDPOINT_MILESTONES}/${cid}/sort`,
      moveAction,
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
