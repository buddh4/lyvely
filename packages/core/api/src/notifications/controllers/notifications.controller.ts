import { Controller, Post, Req, Param, Inject } from '@nestjs/common';
import {
  API_NOTIFICATIONS,
  NotificationsEndpoint,
  IWebNotification,
  NotificationEndpoints,
} from '@lyvely/interface';
import { UserNotificationsService, NotificationService } from '../services';
import { IUserContext, UserInfo, UserRequest } from '@/users';
import { UserNotification } from '../schemas';
import { TestNotification } from '../notifications';
import { SingleUserSubscription } from '@/user-subscriptions';
import { AbstractStreamController } from '@/streams';

@Controller(API_NOTIFICATIONS)
export class NotificationsController
  extends AbstractStreamController<UserNotification, IWebNotification, any, IUserContext>
  implements NotificationsEndpoint
{
  @Inject()
  protected streamEntryService: UserNotificationsService;

  @Inject()
  protected notificationsService: NotificationService;

  protected async mapToResultModel(userNotifications: UserNotification[], context: IUserContext) {
    return this.streamEntryService.mapToResultModel(userNotifications, context);
  }

  @Post(NotificationEndpoints.MARK_AS_SEEN(':nid'))
  async markAsSeen(@Param('nid') nid: string, @Req() req: UserRequest): Promise<void> {
    await this.streamEntryService.markAsSeen(req.user, nid);
  }

  @Post(NotificationEndpoints.TEST)
  async test(@Req() req: UserRequest): Promise<boolean> {
    await this.notificationsService.sendNotification(
      new TestNotification({ testValue: 'Test', userInfo: new UserInfo(req.user) }),
      new SingleUserSubscription(req.user),
    );
    return true;
  }
}
