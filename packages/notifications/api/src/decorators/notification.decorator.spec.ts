import { NotificationContext, NotificationType } from '../schemas';
import { Notification } from './notification.decorator';
import { Translatable } from '@lyvely/i18n';
import { UrlRoute } from '@lyvely/common';
import { expect } from '@jest/globals';
import { createBasicTestingModule } from '@lyvely/testing';
import { TestingModule } from '@nestjs/testing';
import { NotificationTypeRegistry } from '@lyvely/notifications';

const TEST_KEY = 'Notification decorator';

describe('Notification decorator', () => {
  let testingModule: TestingModule;
  let notificationRegistry: NotificationTypeRegistry;

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [], [], []).compile();
    notificationRegistry = testingModule.get(NotificationTypeRegistry);
  });

  it('type is automatically set and registered', () => {
    @Notification()
    class MyNotificationType extends NotificationType {
      constructor(props) {
        super(props);
      }

      getBody(format: NotificationContext): Translatable {
        return undefined;
      }

      getTitle(format: NotificationContext): Translatable {
        return undefined;
      }

      getUrl(): UrlRoute {
        return null;
      }

      getCategory(): string {
        return '';
      }
    }

    const notificationInstance = new MyNotificationType({});
    expect(notificationInstance.type).toEqual(MyNotificationType.typeName);
    expect(notificationInstance.constructor.name).toEqual(MyNotificationType.name);
    expect(notificationInstance instanceof MyNotificationType).toEqual(true);
    expect(notificationRegistry.getTypeConstructor(MyNotificationType.typeName)).toEqual(
      MyNotificationType,
    );
  });
});
