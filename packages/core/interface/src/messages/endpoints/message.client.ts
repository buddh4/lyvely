import { CreateMessageModel, MessageUpdateResponse } from '../models';
import { IMessageClient } from './message.endpoint';
import { useSingleton } from '@lyvely/common';
import repository from './message.repository';
import { IProfileApiRequestOptions, unwrapAndTransformResponse } from '@/endpoints';

export class MessageClient implements IMessageClient {
  async create(model: CreateMessageModel, options?: IProfileApiRequestOptions) {
    return unwrapAndTransformResponse(repository.create(model, options), MessageUpdateResponse);
  }

  async update(
    id: string,
    model: Partial<CreateMessageModel>,
    options?: IProfileApiRequestOptions,
  ) {
    return unwrapAndTransformResponse(repository.update(id, model, options), MessageUpdateResponse);
  }
}

export const useMessageClient = useSingleton(() => new MessageClient());
