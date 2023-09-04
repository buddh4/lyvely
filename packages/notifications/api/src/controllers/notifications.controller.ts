import { Controller, Post, Req, Param, Inject } from '@nestjs/common';
import { ENDPOINT_NOTIFICATIONS, NotificationsEndpoint, IWebNotification } from '@lyvely/common';
import { UserNotificationsService, NotificationService } from '../services';
import { UserInfo, UserRequest } from '@lyvely/users';
import { UserNotification } from '../schemas';
import { TestNotification } from '../notifications';
import { SingleUserSubscription } from '@lyvely/subscription';
import { AbstractStreamController } from '@lyvely/stream';
import { RequestContext } from '@lyvely/profiles';

@Controller(ENDPOINT_NOTIFICATIONS)
export class NotificationsController
  extends AbstractStreamController<UserNotification, IWebNotification>
  implements NotificationsEndpoint
{
  @Inject()
  protected streamEntryService: UserNotificationsService;

  @Inject()
  protected notificationsService: NotificationService;

  protected async mapToResultModel(userNotifications: UserNotification[], context: RequestContext) {
    return this.streamEntryService.mapToResultModel(userNotifications, context);
  }

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
