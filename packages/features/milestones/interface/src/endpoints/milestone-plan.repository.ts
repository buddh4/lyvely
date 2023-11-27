import {
  IMilestonePlanClient,
  ENDPOINT_MILESTONE_PLAN,
  MilestonePlanEndpointPaths,
} from './milestone-plan.endpoint';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { IProfileApiRequestOptions, useApi } from '@lyvely/interface';

const api = useApi<IMilestonePlanClient>(ENDPOINT_MILESTONE_PLAN);

export default {
  async getByFilter(filter: CalendarPlanFilter, options?: IProfileApiRequestOptions) {
    return api.get<'getByFilter'>({
      params: filter,
      ...options,
    });
  },

  async sort(cid: string, moveAction: CalendarPlanSort, options?: IProfileApiRequestOptions) {
    return api.post<'sort'>(MilestonePlanEndpointPaths.SORT(cid), moveAction, options);
  },
};
