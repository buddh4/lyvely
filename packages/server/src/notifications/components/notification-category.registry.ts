import { NotificationCategory } from '../models';
import { Logger } from '@nestjs/common';

export class NotificationCategoryRegistry {
  private static categories = new Map<string, NotificationCategory>();
  private static logger = new Logger(NotificationCategoryRegistry.name);

  static registerCategory(category: NotificationCategory) {
    NotificationCategoryRegistry.logger.log(`Register notification category ${category.getId()}`);
    NotificationCategoryRegistry.categories.set(category.getId(), category);
  }

  static getCategory(categoryId: string) {
    return NotificationCategoryRegistry.categories.get(categoryId);
  }
}
