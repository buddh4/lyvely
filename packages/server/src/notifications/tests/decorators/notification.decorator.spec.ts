import { NotificationType, RenderFormat } from '@/notifications';
import { Notification } from '@/notifications/decorators';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/common';

describe('Notification decorator', () => {
  it('type is automatically set', () => {
    @Notification()
    class MyNotificationType extends NotificationType {
      constructor(props) {
        super(props);
      }

      getBody(format: RenderFormat): Translatable {
        return undefined;
      }

      getTitle(format: RenderFormat): Translatable {
        return undefined;
      }

      getUrl(): UrlRoute {
        return null;
      }
    }

    const notificationInstance = new MyNotificationType({});
    expect(notificationInstance.type === MyNotificationType.name);
    expect(notificationInstance.constructor.name === MyNotificationType.name);
  });

  it('set implicit type', () => {
    @Notification('myType')
    class MyNotificationType extends NotificationType {
      constructor(props) {
        super(props);
      }

      getBody(format: RenderFormat): Translatable {
        return undefined;
      }

      getTitle(format: RenderFormat): Translatable {
        return undefined;
      }

      getUrl(): UrlRoute {
        return null;
      }
    }

    const notificationInstance = new MyNotificationType({});
    expect(notificationInstance.type === 'myType');
    expect(notificationInstance.constructor.name === MyNotificationType.name);
  });
});
