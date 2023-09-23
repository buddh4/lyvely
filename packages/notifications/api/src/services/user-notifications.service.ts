import { Injectable, Logger, Inject } from '@nestjs/common';
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
import { User, UsersService } from '@lyvely/users';
import { assureObjectId, assureStringId, EntityIdentity } from '@lyvely/core';
import { NotificationDao, UserNotificationDao } from '../daos';
import { I18n } from '@lyvely/i18n';
import { LiveService } from '@lyvely/live';
import { AbstractStreamService } from '@lyvely/streams';
import { RequestContext } from '@lyvely/profiles';

@Injectable()
export class UserNotificationsService extends AbstractStreamService<UserNotification> {
  @Inject()
  protected streamEntryDao: UserNotificationDao;

  protected logger = new Logger(UserNotificationsService.name);

  constructor(
    private notificationDao: NotificationDao,
    private i18n: I18n,
    private liveService: LiveService,
    private usersService: UsersService,
  ) {
    super();
  }

  async findOneByNotification(
    userIdentity: EntityIdentity<User>,
    notificationIdentity: EntityIdentity<Notification>,
  ) {
    return this.streamEntryDao.findOne({
      uid: assureObjectId(userIdentity),
      nid: assureObjectId(notificationIdentity),
    });
  }

  async loadEntry(
    context: RequestContext,
    identity: EntityIdentity<UserNotification>,
  ): Promise<UserNotification> {
    const userNotification = await this.streamEntryDao.findOneAndUpdateSetByFilter(
      identity,
      { seen: true },
      {
        uid: assureObjectId(context.user),
      },
    );

    if (!userNotification) return null;

    return userNotification;
  }

  async create(identity: EntityIdentity<User>, notification: Notification) {
    return this.streamEntryDao.save(new UserNotification(identity, notification)).then((result) => {
      this.setUpdateAvailableState(identity, true);
      return result;
    });
  }

  async loadTail(
    context: RequestContext,
    request: StreamRequest,
  ): Promise<IStreamResponse<UserNotification>> {
    const response = await super.loadTail(context, request);

    if (request.isInitialRequest() && context.user.notification.updatesAvailable) {
      this.setUpdateAvailableState(context.user, false);
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

  async updateDeliveryState(userNotification: UserNotification) {
    return this.streamEntryDao.updateOneSetById(userNotification, {
      status: userNotification.status,
    });
  }

  async loadHead(
    context: RequestContext,
    request: StreamRequest,
  ): Promise<StreamResponse<UserNotification>> {
    const response = await super.loadHead(context, request);

    this.setUpdateAvailableState(context.user, false);

    return response;
  }

  async mapToResultModel(userNotifications: UserNotification[], context: RequestContext) {
    const notifications = await this.loadNotifications(userNotifications);

    const models: WebNotification[] = [];
    const toDelete: TObjectId[] = [];
    const { user } = context;

    userNotifications.forEach((userNotification) => {
      const notification = notifications.find((notification) =>
        notification._id.equals(userNotification.nid),
      );

      if (!notification) {
        toDelete.push(userNotification._id);
        return;
      }

      const notificationType = notification.data;
      const notificationContext = { receiver: user, format: RenderFormat.HTML };
      models.push(
        new WebNotification({
          id: userNotification.id,
          type: notificationType.type,
          sortOrder: notification.sortOrder,
          body: this.i18n.t(notificationType.getBody(notificationContext), user),
          title: this.i18n.t(notificationType.getTitle(notificationContext), user),
          seen: userNotification.seen,
          userInfo: notificationType.userInfo?.toModel(),
          profileInfo: notificationType.profileInfo?.toModel(),
          route: notificationType.getUrl(),
        }),
      );
    });

    if (toDelete.length) {
      this.streamEntryDao.deleteManyByIds(toDelete).then(() => {
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
    return this.streamEntryDao.updateOneSetById(userNotification, {
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
      await this.streamEntryDao.updateOneSetById(notification, update);
    } else {
      notification = await this.streamEntryDao.findOneAndUpdateSetByFilter(
        notificationIdentity,
        update,
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

  private deleteNotification(user: User, type: string, filter: any) {
    this.streamEntryDao.deleteMany({
      uid: assureObjectId(user),
    });
  }

  createQueryFilter(context: RequestContext): FilterQuery<UserNotification> {
    return { uid: assureObjectId(context.user) };
  }

  getSortField(): string {
    return 'sortOrder';
  }
}
