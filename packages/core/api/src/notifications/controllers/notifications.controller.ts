import { Post, Req, Param, Inject } from '@nestjs/common';
import {
  API_NOTIFICATIONS,
  NotificationsEndpoint,
  IWebNotification,
  NotificationEndpoints,
  UserRole,
} from '@lyvely/interface';
import { UserNotificationsService, NotificationService } from '../services';
import { IUserContext, UserInfo, UserRequest, UserRoleAccess } from '@/users';
import { UserNotification } from '../schemas';
import { TestNotification } from '../notifications';
import { SingleUserSubscription } from '@/user-subscriptions';
import { AbstractStreamController } from '@/streams';
import { GlobalController } from '@/common';

@GlobalController(API_NOTIFICATIONS)
@UserRoleAccess(UserRole.User)
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

  @UserRoleAccess(UserRole.Admin)
  @Post(NotificationEndpoints.TEST)
  async test(@Req() req: UserRequest): Promise<boolean> {
    await this.notificationsService.sendNotification(
      new TestNotification({ testValue: 'Test', userInfo: new UserInfo(req.user) }),
      new SingleUserSubscription(req.user)
    );
    return true;
  }
}
