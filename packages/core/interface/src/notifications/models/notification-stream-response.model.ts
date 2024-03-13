import { StreamResponse } from '@/streams';
import { IWebNotification } from '../interfaces';
import { Expose } from 'class-transformer';
import { WebNotification } from './web-notification.model';
import { PropertyType } from '@lyvely/common';

export class NotificationStreamResponse extends StreamResponse<IWebNotification> {
  @Expose()
  @PropertyType([WebNotification])
  override models: IWebNotification[];
}
