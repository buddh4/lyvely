import { INotificationContext, NotificationType } from '../schemas';
import { Notification } from './notification.decorator';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/interface';
import { buildTest, ILyvelyTestingModule } from '@/testing';
import { NotificationTypeRegistry } from '../components';
import { notificationITestPlugin } from '../testing';
import { buildProfileTest } from '@/profiles';

const TEST_KEY = 'Notification decorator';

describe('Notification decorator', () => {
  let testingModule: ILyvelyTestingModule;
  let notificationRegistry: NotificationTypeRegistry;

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).plugins([notificationITestPlugin]).compile();
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

      getBody(format: INotificationContext): Translatable {
        return '';
      }

      getTitle(format: INotificationContext): Translatable {
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
      MyNotificationType
    );
  });
});
