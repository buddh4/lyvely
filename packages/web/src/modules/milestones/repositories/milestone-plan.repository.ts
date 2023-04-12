import repository from '@/repository';
import {
  EndpointResult,
  IMilestonePlanEndpointService,
  CalendarPlanFilter,
  ENDPOINT_MILESTONE_PLAN,
  CalendarPlanSort,
} from '@lyvely/common';

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return repository.get<EndpointResult<IMilestonePlanEndpointService['getByFilter']>>(
      ENDPOINT_MILESTONE_PLAN,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return repository.post<EndpointResult<IMilestonePlanEndpointService['sort']>>(
      `${ENDPOINT_MILESTONE_PLAN}/${cid}/sort`,
      moveAction,
    );
  },
};
