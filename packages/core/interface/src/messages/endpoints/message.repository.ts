import { CreateMessageModel } from '../models';
import { API_MESSAGE, IMessageClient } from './message.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IMessageClient>(API_MESSAGE);

export default {
  create: (model: CreateMessageModel, options?: IProfileApiRequestOptions) =>
    api.post<'create'>(model, {}, options),
  update: (id: string, model: Partial<CreateMessageModel>, options?: IProfileApiRequestOptions) =>
    api.put<'update'>(id, model, options),
};
