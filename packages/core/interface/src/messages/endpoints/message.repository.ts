import { CreateMessageModel } from '../models';
import { ENDPOINT_MESSAGE, IMessageClient } from './message.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IMessageClient>(ENDPOINT_MESSAGE);

export default {
  create: (model: CreateMessageModel, options?: IProfileApiRequestOptions) =>
    api.post<'create'>(model, {}, options),
  update: (id: string, model: Partial<CreateMessageModel>, options?: IProfileApiRequestOptions) =>
    api.put<'update'>(id, model, options),
};
