import { IMessageClient, CreateMessageModel, MessageUpdateResponse } from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import repository from '../repositories';
import { unwrapAndTransformResponse, unwrapResponse } from '@/core';

export class MessageService implements IMessageClient {
  async create(model: CreateMessageModel) {
    return unwrapAndTransformResponse(repository.create(model), MessageUpdateResponse);
  }

  async update(id: string, model: Partial<CreateMessageModel>) {
    return unwrapAndTransformResponse(repository.update(id, model), MessageUpdateResponse);
  }

  async archive(messageId: string) {
    return unwrapResponse(repository.archive(messageId));
  }

  async unarchive(messageId: string) {
    return unwrapResponse(repository.unarchive(messageId));
  }
}

export const useMessageService = useSingleton(() => new MessageService());
