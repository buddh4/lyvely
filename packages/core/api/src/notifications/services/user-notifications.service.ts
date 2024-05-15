import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  DocumentNotFoundException,
  IntegrityException,
  IStreamResponse,
  StreamRequest,
  StreamResponse,
  WebNotification,
  NotificationSeenStateLiveEvent,
  NotificationUpdateStateLiveEvent,
} from '@lyvely/interface';
import { AbstractStreamService } from '@/streams';
import {
  RenderFormat,
  Notification,
  UserNotification,
  NotificationDeliveryStatus,
} from '../schemas';
import { FilterQuery, assureObjectId, assureStringId, DocumentIdentity, TObjectId } from '@/core';
import { IUserContext, User, UsersService } from '@/users';
import { NotificationDao, UserNotificationDao } from '../daos';
import { I18n } from '@/i18n';
import { LiveService } from '@/live';

@Injectable()
export class UserNotificationsService extends AbstractStreamService<
  UserNotification,
  any,
  IUserContext
> {
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
    userIdentity: DocumentIdentity<User>,
    notificationIdentity: DocumentIdentity<Notification>,
  ) {
    return this.streamEntryDao.findOne({
      uid: assureObjectId(userIdentity),
      nid: assureObjectId(notificationIdentity),
    });
  }

  override async loadEntry(
    context: IUserContext,
    identity: DocumentIdentity<UserNotification>,
  ): Promise<UserNotification> {
    const userNotification = await this.streamEntryDao.findOneAndUpdateSetByFilter(
      identity,
      { seen: true },
      {
        uid: assureObjectId(context.user),
      },
    );

    if (!userNotification) throw new DocumentNotFoundException();

    return userNotification;
  }

  async create(identity: DocumentIdentity<User>, notification: Notification) {
    return this.streamEntryDao.save(new UserNotification(identity, notification)).then((result) => {
      this.setUpdateAvailableState(identity, true);
      return result;
    });
  }

  override async loadTail(
    context: IUserContext,
    request: StreamRequest,
  ): Promise<IStreamResponse<UserNotification>> {
    if (!context.user)
      throw new IntegrityException('Can not load notifications without user identity');

    const response = await super.loadTail(context, request);

    if (request.isInitialRequest() && context.user.notification.updatesAvailable) {
      this.setUpdateAvailableState(context.user, false);
    }

    return response;
  }

  setUpdateAvailableState(identity: DocumentIdentity<User>, state: boolean) {
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

  override async loadHead(
    context: IUserContext,
    request: StreamRequest,
  ): Promise<StreamResponse<UserNotification>> {
    if (!context.user)
      throw new IntegrityException('Can not load notifications without user identity');

    const response = await super.loadHead(context, request);

    this.setUpdateAvailableState(context.user, false);

    return response;
  }

  async mapToResultModel(userNotifications: UserNotification[], context: IUserContext) {
    const notifications = await this.loadNotifications(userNotifications);

    if (!context.user)
      throw new IntegrityException('Can not load notifications without user identity');

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

  async markAsSeen(user: DocumentIdentity<User>, nid: DocumentIdentity<UserNotification>) {
    return this.updateSeenState(user, nid, true);
  }

  async markAsUnSeen(
    user: DocumentIdentity<User>,
    nid: DocumentIdentity<UserNotification>,
    sortOrder?: number,
  ) {
    const result = this.updateSeenState(user, nid, false, sortOrder);
    this.setUpdateAvailableState(user, true);
    return result;
  }

  private async updateSeenState(
    user: DocumentIdentity<User>,
    notificationIdentity: DocumentIdentity<UserNotification>,
    seen: boolean,
    sortOrder?: number,
  ) {
    let notification: UserNotification | null;
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
      if (!notification) throw new IntegrityException('Could not find user notification');
      oldState = notification.seen;
    }

    if (!notification) throw new DocumentNotFoundException();

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

  createQueryFilter(context: IUserContext): FilterQuery<UserNotification> {
    return { uid: assureObjectId(context.user) };
  }

  getSortField(): string {
    return 'sortOrder';
  }
}
