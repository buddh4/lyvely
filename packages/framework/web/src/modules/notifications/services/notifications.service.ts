import { IWebNotification, INotificationsService, useSingleton } from '@lyvely/common';
import { IStreamState, IStreamOptions, IStreamResponse } from '@lyvely/streams-interface';
import notificationRepository from '../repositories/notifications.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

export class NotificationsService implements INotificationsService {
  async loadTail(
    state: IStreamState,
    options: IStreamOptions,
  ): Promise<IStreamResponse<IWebNotification>> {
    return unwrapResponse(
      notificationRepository.loadTail({
        state,
        batchSize: options.batchSize,
      }),
    );
  }

  async loadHead(
    state: IStreamState,
    options: IStreamOptions,
  ): Promise<IStreamResponse<IWebNotification>> {
    return unwrapResponse(
      notificationRepository.loadHead({
        state,
        batchSize: options.batchSize,
      }),
    );
  }

  async loadEntry(id: string): Promise<IWebNotification> {
    return unwrapResponse(notificationRepository.loadEntry(id));
  }

  async markAsSeen(nid: string): Promise<void> {
    return unwrapResponse(notificationRepository.markAsSeen(nid));
  }

  async test() {
    return notificationRepository.test();
  }
}

export const useNotificationService = useSingleton(() => new NotificationsService());
