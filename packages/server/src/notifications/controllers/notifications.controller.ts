import { Controller, Post, Req, Param, Inject } from '@nestjs/common';
import { ENDPOINT_NOTIFICATIONS, NotificationsEndpoint, IWebNotification } from '@lyvely/common';
import { UserNotificationsService, NotificationService } from '../services';
import { UserInfo, UserRequest } from '@/users';
import { TestNotification } from '@/notifications/schemas/test-notification.schema';
import { SingleUserSubscription } from '@/user-subscription';
import { AbstractStreamController } from '@/stream';
import { UserNotification } from '@/notifications';

@Controller(ENDPOINT_NOTIFICATIONS)
export class NotificationsController
  extends AbstractStreamController<UserNotification, IWebNotification>
  implements NotificationsEndpoint
{
  @Inject()
  protected streamEntryService: UserNotificationsService;

  @Inject()
  protected notificationsService: NotificationService;

  @Post(':nid/mark-as-seen')
  async markAsSeen(@Param('nid') nid: string, @Req() req: UserRequest): Promise<void> {
    await this.streamEntryService.markAsSeen(req.user, nid);
  }

  @Post('test')
  async test(@Req() req: UserRequest): Promise<boolean> {
    await this.notificationsService.sendNotification(
      new TestNotification({ testValue: 'Test', userInfo: new UserInfo(req.user) }),
      new SingleUserSubscription(req.user),
    );
    return true;
  }
}
