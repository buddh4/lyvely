import { Injectable, Logger } from '@nestjs/common';
import { NotificationType } from '../schemas/notification-type.schema';
import { AbstractTypeRegistry } from '@/core/components/abstract-type.registry';

@Injectable()
export class NotificationTypeRegistry extends AbstractTypeRegistry<NotificationType> {
  constructor() {
    super(new Logger(NotificationTypeRegistry.name));
  }
}
