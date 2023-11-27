import { CreateJournalModel, UpdateJournalModel } from '../models';
import {
  ENDPOINT_JOURNALS,
  IJournalsEndpointService,
  JournalsEndpointPaths,
} from './journals.endpoint';
import { UpdateDataPointModel } from '@lyvely/time-series-interface';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-interface';
import { useApi, IProfileApiRequestOptions } from '@lyvely/interface';

const api = useApi<IJournalsEndpointService>(ENDPOINT_JOURNALS);

export default {
  async create(model: CreateJournalModel, options?: IProfileApiRequestOptions) {
    return api.post<'create'>(model, {}, options);
  },

  async update(
    habitId: string,
    model: Partial<UpdateJournalModel>,
    options?: IProfileApiRequestOptions,
  ) {
    return api.put<'update'>(habitId, model, options);
  },

  async getByFilter(params: CalendarPlanFilter, options?: IProfileApiRequestOptions) {
    return api.get<'getByFilter'>({ params, ...options });
  },

  async sort(cid: string, sort: CalendarPlanSort, options?: IProfileApiRequestOptions) {
    return api.post<'sort'>(JournalsEndpointPaths.SORT(cid), sort, options);
  },

  async updateDataPoint(
    cid: string,
    dto: UpdateDataPointModel,
    options?: IProfileApiRequestOptions,
  ) {
    return api.post<'updateDataPoint'>(JournalsEndpointPaths.UPDATE_DATA_POINT(cid), dto, options);
  },
};
