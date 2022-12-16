import { Injectable } from '@nestjs/common';
import { IStreamResponse, StreamRequest, StreamResponse, WebNotification } from '@lyvely/common';
import { RenderFormat, UserNotification } from '../schemas';
import { FilterQuery } from 'mongoose';
import { User } from '@/users';
import { assureObjectId } from '@/core';
import { cloneDeep } from 'lodash';
import { NotificationDao, UserNotificationDao } from '../daos';
import { I18n, Translatable } from '@/i18n';

const DEFAULT_BATCH_SIZE = 12;

@Injectable()
export class UserNotificationsService {
  constructor(
    private userNotificationDao: UserNotificationDao,
    private notificationDao: NotificationDao,
    private i18n: I18n,
  ) {}

  async loadNext(user: User, request: StreamRequest): Promise<IStreamResponse<WebNotification>> {
    const filter: FilterQuery<UserNotification> = { uid: assureObjectId(user) };

    if (request.state?.lastOrder) {
      filter['sortOrder'] = { $gte: request.state.lastOrder };
      if (request.state.lastId) {
        filter['_id'] = { $gt: request.state.lastId };
      }
    }

    const batchSize = request.batchSize || DEFAULT_BATCH_SIZE;

    const userNotifications = await this.userNotificationDao.findAll(filter, {
      sort: { sortOrder: 1, _id: 1 },
      limit: batchSize,
    });

    const notifications = await this.loadNotifications(userNotifications);

    const models: WebNotification[] = [];
    const toDelete: TObjectId[] = [];

    userNotifications.forEach((userNotification) => {
      const notification = notifications.find((notification) =>
        notification._id.equals(userNotification.nid),
      );

      if (!notification) {
        toDelete.push(userNotification._id);
        return;
      }

      const notificationType = notification.data;

      models.push(
        new WebNotification({
          id: userNotification.id,
          type: notificationType.type,
          body: this.translate(user, notificationType.getBody(RenderFormat.HTML)),
          title: this.translate(user, notificationType.getTitle(RenderFormat.HTML)),
          seen: userNotification.seen,
          userInfo: notificationType.userInfo?.getDto(),
          profileInfo: notificationType.profileInfo?.getDto(),
        }),
      );
    });

    if (toDelete.length) {
      this.userNotificationDao.deleteManyByIds(toDelete).then(() => {
        /* Nothing todo */
      });
    }

    const response: IStreamResponse<WebNotification> = {
      models,
      state: request.state ? cloneDeep(request.state) : {},
      hasMore: true,
    };

    if (userNotifications.length) {
      response.state.lastId = userNotifications[userNotifications.length - 1].id;
      response.state.lastOrder = userNotifications[userNotifications.length - 1].sortOrder;

      if (!response.state.firstId) {
        response.state.firstId = userNotifications[0].id;
        response.state.firstOrder = userNotifications[0].sortOrder;
      }
    }

    if (userNotifications.length < batchSize) {
      response.hasMore = false;
    }

    response.state.isEnd = !response.hasMore;

    return response;
  }

  private translate(user: User, translatable: Translatable) {
    return this.i18n.t(translatable, user);
  }

  private async loadNotifications(userNotifications: UserNotification[]) {
    if (!userNotifications.length) return [];
    const notificationIds = userNotifications.map((userNotification) => userNotification.nid);
    return this.notificationDao.findAllByIds(notificationIds);
  }

  async update(user: User, request: StreamRequest): Promise<StreamResponse<WebNotification>> {
    const filter: FilterQuery<UserNotification> = { uid: assureObjectId(user) };
    if (request.state.firstOrder) {
      filter['sortOrder'] = { $lte: request.state.firstOrder };
      if (request.state.firstId) {
        filter['_id'] = { $lt: request.state.lastId };
      }
    }

    const batchSize = request.batchSize || DEFAULT_BATCH_SIZE;

    const models = await this.userNotificationDao.findAll(
      {},
      { sort: { sortOrder: 1, _id: 1 }, limit: batchSize },
    );

    const response: IStreamResponse<any> = {
      models: models,
      state: cloneDeep(request.state),
      hasMore: true,
    };

    if (models.length) {
      response.state.firstId = models[0].id;
      response.state.firstOrder = models[0].sortOrder;
    }

    if (models.length < batchSize) {
      response.hasMore = false;
    }

    return response;
  }
}
