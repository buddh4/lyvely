import { Injectable, Logger } from '@nestjs/common';
import { INotificationChannel } from '../interfaces';

@Injectable()
export class NotificationChannelRegistry {
  private logger = new Logger(NotificationChannelRegistry.name);
  private channels: Array<INotificationChannel> = [];

  getNotificationChannels(): Array<INotificationChannel> {
    return this.channels;
  }

  getNotificationChannel(id: string) {
    return this.channels.find((c) => c.getId() === id);
  }

  registerChannel(channel: INotificationChannel) {
    if (!this.getNotificationChannel(channel.getId())) {
      this.channels.push(channel);
    }
  }
}
