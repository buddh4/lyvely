import { repository } from '@lyvely/web';
import {
  IMilestonePlanEndpointService,
  ENDPOINT_MILESTONE_PLAN,
} from '@lyvely/milestones-interface';
import { EndpointResult } from '@lyvely/common';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-web';

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
