import { Controller, Post, Body } from '@nestjs/common';
import {
  ENDPOINT_NOTIFICATIONS,
  NotificationsEndpoint,
  IStreamResponse,
  IWebNotification,
  StreamRequest,
} from '@lyvely/common';
import { UserNotificationsService } from '../services/user-notifications.service';

@Controller(ENDPOINT_NOTIFICATIONS)
export class NotificationsController implements NotificationsEndpoint {
  constructor(private readonly notificationService: UserNotificationsService) {}

  @Post('load-next')
  loadNext(@Body() request: StreamRequest): Promise<IStreamResponse<IWebNotification>> {
    return Promise.resolve(undefined);
  }

  @Post('update')
  update(@Body() request: StreamRequest): Promise<IStreamResponse<IWebNotification>> {
    return Promise.resolve(undefined);
  }
}
