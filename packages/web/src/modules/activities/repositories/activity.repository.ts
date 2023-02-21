import repository from '@/repository';
import {
  ENDPOINT_ACTIVITIES,
  DataPointIntervalFilter,
  MoveAction,
  EndpointResult,
  IActivityEndpointService,
} from '@lyvely/common';

export default {
  async getByFilter(filter: DataPointIntervalFilter) {
    return repository.get<EndpointResult<IActivityEndpointService['getByFilter']>>(
      `${ENDPOINT_ACTIVITIES}`,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, moveAction: MoveAction) {
    return repository.post<EndpointResult<IActivityEndpointService['sort']>>(
      `${ENDPOINT_ACTIVITIES}/${cid}/sort`,
      moveAction,
    );
  },
};
