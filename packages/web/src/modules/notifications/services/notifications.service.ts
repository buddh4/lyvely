import { IWebNotification, INotificationsService, IStreamState, IStreamOptions, IStreamResponse } from '@lyvely/common';
import notificationRepository from '../repositories/notifications.repository';
import { unwrapResponse } from '@/modules/core';

export class NotificationsService implements INotificationsService {
  loadNext(state: IStreamState, options: IStreamOptions): Promise<IStreamResponse<IWebNotification>> {
    return unwrapResponse(
      notificationRepository.loadNext({
        state,
        batchSize: options.batchSize,
      }),
    );
  }

  update(state: IStreamState, options: IStreamOptions): Promise<IStreamResponse<IWebNotification>> {
    return unwrapResponse(
      notificationRepository.update({
        state,
        batchSize: options.batchSize,
      }),
    );
  }
}
