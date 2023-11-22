import {
  ENDPOINT_JOURNALS,
  IJournalsEndpointService,
  CreateJournalModel,
  UpdateJournalModel,
} from '@lyvely/journals-interface';
import { UpdateDataPointModel } from '@lyvely/time-series-web';
import { EndpointResult } from '@lyvely/common';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-web';
import { useApiRepository } from '@lyvely/core-interface';

export default {
  async create(model: CreateJournalModel) {
    return useApiRepository().post<EndpointResult<IJournalsEndpointService['create']>>(
      `${ENDPOINT_JOURNALS}`,
      model,
    );
  },

  async update(habitId: string, model: Partial<UpdateJournalModel>) {
    return useApiRepository().put<EndpointResult<IJournalsEndpointService['update']>>(
      `${ENDPOINT_JOURNALS}/${habitId}`,
      model,
    );
  },

  async getByFilter(filter: CalendarPlanFilter) {
    return useApiRepository().get<EndpointResult<IJournalsEndpointService['getByFilter']>>(
      `${ENDPOINT_JOURNALS}`,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, sort: CalendarPlanSort) {
    return useApiRepository().post<EndpointResult<IJournalsEndpointService['sort']>>(
      `${ENDPOINT_JOURNALS}/${cid}/sort`,
      sort,
    );
  },

  async updateDataPoint(cid: string, dto: UpdateDataPointModel) {
    return useApiRepository().post<EndpointResult<IJournalsEndpointService['updateDataPoint']>>(
      `${ENDPOINT_JOURNALS}/${cid}/update-data-point`,
      dto,
    );
  },
};
