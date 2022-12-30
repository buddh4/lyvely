import { IMessageClient, CreateMessage, useSingleton, MessageUpdateResponse } from '@lyvely/common';
import repository from '../repositories';
import { unwrapAndCastResponse, unwrapResponse } from '@/modules/core';

export class MessageService implements IMessageClient {
  async create(model: CreateMessage) {
    return unwrapAndCastResponse(repository.create(model), MessageUpdateResponse);
  }

  async update(id: string, model: Partial<CreateMessage>) {
    return unwrapAndCastResponse(repository.update(id, model), MessageUpdateResponse);
  }

  async archive(messageId: string) {
    return unwrapResponse(repository.archive(messageId));
  }

  async unarchive(messageId: string) {
    return unwrapResponse(repository.unarchive(messageId));
  }
}

export const useMessageService = useSingleton(() => new MessageService());
