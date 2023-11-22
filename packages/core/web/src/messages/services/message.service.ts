import { IMessageClient, CreateMessageModel, MessageUpdateResponse } from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import repository from '../repositories';
import { unwrapAndTransformResponse } from '@/core';

export class MessageService implements IMessageClient {
  async create(model: CreateMessageModel) {
    return unwrapAndTransformResponse(repository.create(model), MessageUpdateResponse);
  }

  async update(id: string, model: Partial<CreateMessageModel>) {
    return unwrapAndTransformResponse(repository.update(id, model), MessageUpdateResponse);
  }
}

export const useMessageService = useSingleton(() => new MessageService());
