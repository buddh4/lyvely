import { NotificationContext, NotificationType } from '../schemas';
import { Notification } from './notification.decorator';
import { Translatable } from '@lyvely/i18n';
import { UrlRoute } from '@lyvely/common';
import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { NotificationTypeRegistry } from '../components';
import { notificationTestPlugin } from '../testing';

const TEST_KEY = 'Notification decorator';

describe('Notification decorator', () => {
  let testingModule: LyvelyTestingModule;
  let notificationRegistry: NotificationTypeRegistry;

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([notificationTestPlugin]).compile();
    notificationRegistry = testingModule.get(NotificationTypeRegistry);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('type is automatically set and registered', () => {
    @Notification()
    class MyNotificationType extends NotificationType {
      constructor(props) {
        super(props);
      }

      getBody(format: NotificationContext): Translatable {
        return '';
      }

      getTitle(format: NotificationContext): Translatable {
        return '';
      }

      getUrl(): UrlRoute | null {
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
