import repository from '@/repository';
import {
  ENDPOINT_JOURNALS,
  DataPointIntervalFilter,
  MoveAction,
  EndpointResult,
  IJournalsEndpointService,
  UpdateDataPointModel,
} from '@lyvely/common';

export default {
  async getByFilter(filter: DataPointIntervalFilter) {
    return repository.get<EndpointResult<IJournalsEndpointService['getByFilter']>>(
      `${ENDPOINT_JOURNALS}`,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, moveAction: MoveAction) {
    return repository.post<EndpointResult<IJournalsEndpointService['sort']>>(
      `${ENDPOINT_JOURNALS}/${cid}/sort`,
      moveAction,
    );
  },

  async updateDataPoint(cid: string, dto: UpdateDataPointModel) {
    return repository.post<EndpointResult<IJournalsEndpointService['updateDataPoint']>>(
      `${ENDPOINT_JOURNALS}/${cid}/update-data-point`,
      dto,
    );
  },
};
