import {
  IMilestonePlanEndpointService,
  ENDPOINT_MILESTONE_PLAN,
} from '@lyvely/milestones-interface';
import { EndpointResult } from '@lyvely/common';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-web';
import { useApiRepository } from '@lyvely/interface';

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return useApiRepository().get<EndpointResult<IMilestonePlanEndpointService['getByFilter']>>(
      ENDPOINT_MILESTONE_PLAN,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return useApiRepository().post<EndpointResult<IMilestonePlanEndpointService['sort']>>(
      `${ENDPOINT_MILESTONE_PLAN}/${cid}/sort`,
      moveAction,
    );
  },
};
