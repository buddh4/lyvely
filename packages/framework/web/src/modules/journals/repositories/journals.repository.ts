import repository from '@/repository';
import {
  ENDPOINT_JOURNALS,
  IJournalsEndpointService,
  UpdateDataPointModel,
  CreateJournalModel,
  UpdateJournalModel,
} from '@lyvely/journals-interface';
import { EndpointResult } from '@lyvely/common';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-interface';

export default {
  async create(model: CreateJournalModel) {
    return repository.post<EndpointResult<IJournalsEndpointService['create']>>(
      `${ENDPOINT_JOURNALS}`,
      model,
    );
  },

  async update(habitId: string, model: Partial<UpdateJournalModel>) {
    return repository.put<EndpointResult<IJournalsEndpointService['update']>>(
      `${ENDPOINT_JOURNALS}/${habitId}`,
      model,
    );
  },

  async getByFilter(filter: CalendarPlanFilter) {
    return repository.get<EndpointResult<IJournalsEndpointService['getByFilter']>>(
      `${ENDPOINT_JOURNALS}`,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, sort: CalendarPlanSort) {
    return repository.post<EndpointResult<IJournalsEndpointService['sort']>>(
      `${ENDPOINT_JOURNALS}/${cid}/sort`,
      sort,
    );
  },

  async updateDataPoint(cid: string, dto: UpdateDataPointModel) {
    return repository.post<EndpointResult<IJournalsEndpointService['updateDataPoint']>>(
      `${ENDPOINT_JOURNALS}/${cid}/update-data-point`,
      dto,
    );
  },
};
