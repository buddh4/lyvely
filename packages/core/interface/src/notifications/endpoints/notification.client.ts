import { useSingleton } from '@lyvely/common';
import { IWebNotification } from '../interfaces';
import { INotificationsClient } from './notification.endpoint';
import { IStreamState, IStreamOptions, IStreamResponse } from '@/streams';
import notificationRepository from './notification.repository';
import { unwrapResponse } from '@/endpoints';

export class NotificationClient implements INotificationsClient {
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
    return unwrapResponse(notificationRepository.test());
  }
}

export const useNotificationClient = useSingleton(() => new NotificationClient());
