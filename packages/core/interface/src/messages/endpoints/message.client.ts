import { CreateMessageModel, MessageUpdateResponse } from '../models';
import { IMessageClient } from './message.endpoint';
import { useSingleton } from '@lyvely/common';
import repository from './message.repository';
import { unwrapAndTransformResponse } from '@/endpoints';

export class MessageClient implements IMessageClient {
  async create(model: CreateMessageModel) {
    return unwrapAndTransformResponse(repository.create(model), MessageUpdateResponse);
  }

  async update(id: string, model: Partial<CreateMessageModel>) {
    return unwrapAndTransformResponse(repository.update(id, model), MessageUpdateResponse);
  }
}

export const useMessageClient = useSingleton(() => new MessageClient());
