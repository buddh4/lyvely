import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import {
  ENDPOINT_NOTIFICATIONS,
  NotificationsEndpoint,
  IStreamResponse,
  IWebNotification,
  StreamRequest,
} from '@lyvely/common';
import { UserNotificationsService, NotificationService } from '../services';
import { UserRequest } from '@/users';
import { TestNotification } from '@/notifications/schemas/test-notification.schema';
import { UserSubscription } from '@/notifications';

@Controller(ENDPOINT_NOTIFICATIONS)
export class NotificationsController implements NotificationsEndpoint {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
    private readonly notificationsService: NotificationService,
  ) {}

  @Post('load-next')
  async loadNext(@Body() request: StreamRequest): Promise<IStreamResponse<IWebNotification>> {
    return Promise.resolve(undefined);
  }

  @Post('update')
  async update(@Body() request: StreamRequest): Promise<IStreamResponse<IWebNotification>> {
    return Promise.resolve(undefined);
  }

  @Post('test')
  async test(@Req() req: UserRequest): Promise<boolean> {
    await this.notificationsService.sendNotification(
      new TestNotification({ testValue: 'Test' }),
      new UserSubscription(req.user),
    );
    return true;
  }
}
