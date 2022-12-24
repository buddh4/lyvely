import { StreamResponse } from '@/stream/models/stream-response.model';
import { IWebNotification } from '../interfaces';
import { Expose, Type } from 'class-transformer';
import { WebNotification } from './web-notification.model';

export class NotificationStreamResponse extends StreamResponse<IWebNotification> {
  @Expose()
  @Type(() => WebNotification)
  models: IWebNotification[];
}
