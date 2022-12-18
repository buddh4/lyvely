import { Injectable, Logger } from '@nestjs/common';
import {
  EntityNotFoundException,
  IStreamResponse,
  StreamRequest,
  StreamResponse,
  WebNotification,
  NotificationSeenStateLiveEvent,
  NotificationUpdateStateLiveEvent,
} from '@lyvely/common';
import {
  RenderFormat,
  Notification,
  UserNotification,
  NotificationDeliveryStatus,
} from '../schemas';
import { FilterQuery } from 'mongoose';
import { User, UsersService } from '@/users';
import { assureObjectId, assureStringId, EntityIdentity } from '@/core';
import { cloneDeep } from 'lodash';
import { NotificationDao, UserNotificationDao } from '../daos';
import { I18n } from '@/i18n';
import { LiveService } from '@/live';

const DEFAULT_BATCH_SIZE = 12;

@Injectable()
export class UserNotificationsService {
  private logger = new Logger(UserNotificationsService.name);

  constructor(
    private userNotificationDao: UserNotificationDao,
    private notificationDao: NotificationDao,
    private i18n: I18n,
    private liveService: LiveService,
    private usersService: UsersService,
  ) {}

  async findOne(
    userIdentity: EntityIdentity<User>,
    notificationIdentity: EntityIdentity<Notification>,
  ) {
    return await this.userNotificationDao.findOne({
      uid: assureObjectId(userIdentity),
      nid: assureObjectId(notificationIdentity),
    });
  }

  async create(identity: EntityIdentity<User>, notification: Notification) {
    return this.userNotificationDao
      .save(new UserNotification(identity, notification))
      .then((result) => {
        this.setUpdateAvailableState(identity, true);
        return result;
      });
  }

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

    const models = await this.mapToWebNotification(userNotifications, user);

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

    if (request.isInitialRequest() && user.notification.updatesAvailable) {
      this.setUpdateAvailableState(user, false);
    }

    return response;
  }

  setUpdateAvailableState(identity: EntityIdentity<User>, state: boolean) {
    this.usersService
      .updateNotificationUpdateState(identity, state)
      .catch((err) => this.logger.error(err));
    this.liveService.emitUserEvent(
      new NotificationUpdateStateLiveEvent(assureStringId(identity), state),
    );
  }

  async update(user: User, request: StreamRequest): Promise<StreamResponse<WebNotification>> {
    const filter: FilterQuery<UserNotification> = { uid: assureObjectId(user) };
    if (request.state.firstOrder) {
      filter['sortOrder'] = { $lte: request.state.firstOrder };
      if (request.state.firstId) {
        filter['_id'] = { $lt: request.state.lastId };
      }
    }

    /**
     * TODO: maybe we should use another limit for update calls since in most cases we want all updates
     * and there should be rarely more than the batchSize anyways
     **/
    const batchSize = request.batchSize || DEFAULT_BATCH_SIZE;

    const userNotifications = await this.userNotificationDao.findAll(filter, {
      sort: { sortOrder: 1, _id: 1 },
      limit: batchSize,
    });

    const models = await this.mapToWebNotification(userNotifications, user);

    const response: IStreamResponse<any> = {
      models: models,
      state: cloneDeep(request.state),
      hasMore: true,
    };

    if (models.length) {
      response.state.firstId = userNotifications[0].id;
      response.state.firstOrder = userNotifications[0].sortOrder;
    }

    if (models.length < batchSize) {
      response.hasMore = false;
    }

    this.setUpdateAvailableState(user, false);

    return response;
  }

  private async mapToWebNotification(userNotifications: UserNotification[], user: User) {
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
          body: this.i18n.t(notificationType.getBody(RenderFormat.HTML), user),
          title: this.i18n.t(notificationType.getTitle(RenderFormat.HTML), user),
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

    return models;
  }

  private async loadNotifications(userNotifications: UserNotification[]) {
    if (!userNotifications.length) return [];
    const notificationIds = userNotifications.map((userNotification) => userNotification.nid);
    return this.notificationDao.findAllByIds(notificationIds);
  }

  async resetDeliveryState(userNotification: UserNotification) {
    return this.userNotificationDao.updateOneSetById(userNotification, {
      seen: false,
      sortOrder: userNotification.sortOrder,
      status: new NotificationDeliveryStatus(),
    });
  }

  async markAsSeen(user: EntityIdentity<User>, nid: EntityIdentity<UserNotification>) {
    return this.updateSeenState(user, nid, true);
  }

  async markAsUnSeen(
    user: EntityIdentity<User>,
    nid: EntityIdentity<UserNotification>,
    sortOrder?: number,
  ) {
    const result = this.updateSeenState(user, nid, false, sortOrder);
    this.setUpdateAvailableState(user, true);
    return result;
  }

  private async updateSeenState(
    user: EntityIdentity<User>,
    notificationIdentity: EntityIdentity<UserNotification>,
    seen: boolean,
    sortOrder?: number,
  ) {
    let notification: UserNotification;
    let oldState: boolean;
    const update = sortOrder ? { seen, sortOrder } : { seen };

    if (notificationIdentity instanceof UserNotification) {
      notification = notificationIdentity;
      oldState = notification.seen;
      sortOrder = sortOrder ?? notification.sortOrder;
      await this.userNotificationDao.updateOneSetById(notification, update);
    } else {
      notification = await this.userNotificationDao.findOneAndUpdateByFilter(
        notificationIdentity,
        { $set: update },
        { uid: assureObjectId(user) },
        { new: false },
      );
      oldState = notification.seen;
    }

    if (!notification) throw new EntityNotFoundException();

    if (oldState !== seen) {
      this.liveService.emitUserEvent(
        new NotificationSeenStateLiveEvent(
          assureStringId(user),
          assureStringId(notificationIdentity),
          seen,
        ),
      );
    }
  }
}
