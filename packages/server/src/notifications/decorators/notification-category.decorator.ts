import { Type } from '@lyvely/common';
import { INotificationCategory } from '../interfaces';
import { NotificationCategoryRegistry } from '../components';

export function NotificationCategory() {
  return function <T extends Type<INotificationCategory>>(constructor: T) {
    NotificationCategoryRegistry.registerCategory(new constructor());
    return constructor;
  };
}
