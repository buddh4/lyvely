import { CreateJournalModel, UpdateJournalModel } from '../models';
import {
  ENDPOINT_JOURNALS,
  IJournalsEndpointService,
  JournalsEndpointPaths,
} from './journals.endpoint';
import { UpdateDataPointModel } from '@lyvely/time-series-interface';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-interface';
import { useApi } from '@lyvely/interface';

const api = useApi<IJournalsEndpointService>(ENDPOINT_JOURNALS);

export default {
  async create(model: CreateJournalModel) {
    return api.post<'create'>(`${ENDPOINT_JOURNALS}`, model);
  },

  async update(habitId: string, model: Partial<UpdateJournalModel>) {
    return api.put<'update'>(habitId, model);
  },

  async getByFilter(params: CalendarPlanFilter) {
    return api.get<'getByFilter'>({ params });
  },

  async sort(cid: string, sort: CalendarPlanSort) {
    return api.post<'sort'>(JournalsEndpointPaths.SORT(cid), sort);
  },

  async updateDataPoint(cid: string, dto: UpdateDataPointModel) {
    return api.post<'updateDataPoint'>(JournalsEndpointPaths.UPDATE_DATA_POINT(cid), dto);
  },
};
