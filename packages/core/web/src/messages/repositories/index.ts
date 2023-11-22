import {
  ENDPOINT_MESSAGE,
  CreateMessageModel,
  IMessageClient,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

export default {
  create(model: CreateMessageModel) {
    return useApiRepository().post<EndpointResult<IMessageClient['create']>>(
      `${ENDPOINT_MESSAGE}`,
      model,
    );
  },

  update(id: string, model: Partial<CreateMessageModel>) {
    return useApiRepository().put<EndpointResult<IMessageClient['update']>>(
      `${ENDPOINT_MESSAGE}/${id}`,
      model,
    );
  },
};
