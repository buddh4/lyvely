import { StreamResponse } from '@/streams';
import { IWebNotification } from '../interfaces';
import { Expose, Type } from 'class-transformer';
import { WebNotification } from './web-notification.model';

export class NotificationStreamResponse extends StreamResponse<IWebNotification> {
  @Expose()
  @Type(() => WebNotification)
  models: IWebNotification[];
}