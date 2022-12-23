import { IMessageClient, CreateMessage, MessageModel, useSingleton } from '@lyvely/common';
import repository from '../repositories';
import { unwrapAndCastResponse } from '@/modules/core';

export class MessageService implements IMessageClient {
  create(model: CreateMessage) {
    return unwrapAndCastResponse(repository.create(model), MessageModel);
  }
  archive(messageId: string) {
    return repository.archive(messageId);
  }

  unArchive(messageId: string) {
    return repository.unarchive(messageId);
  }
}

export const useMessageService = useSingleton(() => new MessageService());
