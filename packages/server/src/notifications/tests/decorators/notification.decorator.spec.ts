import { NotificationType, RenderFormat } from '@/notifications';
import { Notification } from '@/notifications/decorators';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/common';
import { expect } from '@jest/globals';

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
    expect(notificationInstance.type).toEqual(MyNotificationType.typeName);
    expect(notificationInstance.constructor.name).toEqual(MyNotificationType.name);
    expect(notificationInstance instanceof MyNotificationType).toEqual(true);
  });
});
