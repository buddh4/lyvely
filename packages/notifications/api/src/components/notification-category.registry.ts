import { INotificationCategory } from '../interfaces';
import { Logger } from '@nestjs/common';

export class NotificationCategoryRegistry {
  private static categories = new Map<string, INotificationCategory>();
  private static logger = new Logger(NotificationCategoryRegistry.name);

  static registerCategory(category: INotificationCategory) {
    NotificationCategoryRegistry.logger.log(`Register notification category ${category.getId()}`);
    NotificationCategoryRegistry.categories.set(category.getId(), category);
  }

  static getCategory(categoryId: string) {
    return NotificationCategoryRegistry.categories.get(categoryId);
  }
}
