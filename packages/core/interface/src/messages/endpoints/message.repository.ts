import { CreateMessageModel } from '../models';
import { ENDPOINT_MESSAGE, IMessageClient } from './message.endpoint';
import { useApi } from '@/repository';

const api = useApi<IMessageClient>(ENDPOINT_MESSAGE);

export default {
  create: (model: CreateMessageModel) => api.post<'create'>(model),
  update: (id: string, model: Partial<CreateMessageModel>) => api.put<'update'>(id, model),
};
