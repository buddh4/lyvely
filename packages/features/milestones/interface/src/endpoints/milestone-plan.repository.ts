import {
  IMilestonePlanClient,
  ENDPOINT_MILESTONE_PLAN,
  MilestonePlanEndpointPaths,
} from './milestone-plan.endpoint';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { useApi } from '@lyvely/interface';

const api = useApi<IMilestonePlanClient>(ENDPOINT_MILESTONE_PLAN);

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return api.get<'getByFilter'>({
      params: filter,
    });
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return api.post<'sort'>(MilestonePlanEndpointPaths.SORT(cid), moveAction);
  },
};
