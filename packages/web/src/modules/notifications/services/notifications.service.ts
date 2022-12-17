import {
  IWebNotification,
  INotificationsService,
  IStreamState,
  IStreamOptions,
  IStreamResponse,
  useSingleton,
} from '@lyvely/common';
import notificationRepository from '../repositories/notifications.repository';
import { unwrapResponse } from '@/modules/core';

export class NotificationsService implements INotificationsService {
  async loadNext(
    state: IStreamState,
    options: IStreamOptions,
  ): Promise<IStreamResponse<IWebNotification>> {
    return unwrapResponse(
      notificationRepository.loadNext({
        state,
        batchSize: options.batchSize,
      }),
    );
  }

  async update(
    state: IStreamState,
    options: IStreamOptions,
  ): Promise<IStreamResponse<IWebNotification>> {
    return unwrapResponse(
      notificationRepository.update({
        state,
        batchSize: options.batchSize,
      }),
    );
  }

  async markAsSeen(nid: string) {
    return unwrapResponse(notificationRepository.markAsSeen(nid));
  }

  async test() {
    return notificationRepository.test();
  }
}

export const useNotificationService = useSingleton(() => new NotificationsService());
