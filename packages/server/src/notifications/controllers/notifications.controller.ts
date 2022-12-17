import { Controller, Post, Body, Req, Param } from '@nestjs/common';
import {
  ENDPOINT_NOTIFICATIONS,
  NotificationsEndpoint,
  IStreamResponse,
  IWebNotification,
  StreamRequest,
} from '@lyvely/common';
import { UserNotificationsService, NotificationService } from '../services';
import { UserInfo, UserRequest } from '@/users';
import { TestNotification } from '@/notifications/schemas/test-notification.schema';
import { SingleUserSubscription } from '@/user-subscription';

@Controller(ENDPOINT_NOTIFICATIONS)
export class NotificationsController implements NotificationsEndpoint {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
    private readonly notificationsService: NotificationService,
  ) {}

  @Post('load-next')
  async loadNext(
    @Body() streamRequest: StreamRequest,
    @Req() req: UserRequest,
  ): Promise<IStreamResponse<IWebNotification>> {
    return this.userNotificationsService.loadNext(req.user, streamRequest);
  }

  @Post('update')
  async update(
    @Body() streamRequest: StreamRequest,
    @Req() req: UserRequest,
  ): Promise<IStreamResponse<IWebNotification>> {
    return this.userNotificationsService.update(req.user, streamRequest);
  }

  @Post(':nid/mark-as-seen')
  async markAsSeen(@Param('nid') nid: string, @Req() req: UserRequest): Promise<void> {
    console.log(nid);
    await this.userNotificationsService.markAsSeen(req.user, nid);
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
