import repository from '@/repository';
import {
  ENDPOINT_JOURNALS,
  DataPointIntervalFilter,
  MoveAction,
  EndpointResult,
  IJournalsEndpointService,
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
};
