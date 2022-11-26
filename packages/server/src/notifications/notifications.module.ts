import { Module } from '@nestjs/common';
import { NotificationTypeRegistry } from '@/notifications/components/notification-type.registry';

@Module({})
export class NotificationsModule {
  static forRoot() {
    return {
      module: NotificationsModule,
      imports: [NotificationsModule.registerCore()],
    };
  }

  static registerCore() {
    return {
      module: NotificationsModule,
      imports: [],
      providers: [NotificationTypeRegistry],
      exports: [NotificationTypeRegistry],
    };
  }
}
