import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users';
import { Notification, ProfileSubscription, UsersSubscription, UserSubscription } from '../schemas';
import { UserSubscriptionContext } from '../interfaces';
import { ProfilesService } from '@/profiles';

@Injectable()
export class NotificationSubscriptionService {
  constructor(private userService: UsersService, private profileService: ProfilesService) {}

  async getSubscriptionContext(
    notification: Notification,
  ): Promise<Array<UserSubscriptionContext>> {
    switch (notification.data.type) {
      case UserSubscription.typeName:
        return this.getUserSubscriptionContext(notification);
      case UsersSubscription.typeName:
        return this.getUsersSubscriptionContext(notification);
      case ProfileSubscription.typeName:
        return this.getProfileSubscriptionContext(notification);
    }

    return [];
  }

  private async getUserSubscriptionContext(
    notification: Notification<any, UserSubscription>,
  ): Promise<UserSubscriptionContext[]> {
    const user = await this.userService.findUserById(notification.subscription.uid);

    if (!user) return [];
    if (!notification.pid) return [{ user }];

    return [await this.profileService.findUserProfileRelations(user, notification.pid)];
  }

  private async getUsersSubscriptionContext(
    notification: Notification<any, UsersSubscription>,
  ): Promise<UserSubscriptionContext[]> {
    const users = await this.userService.findUsersById(notification.subscription.uids);

    if (!users?.length) return [];
    if (!notification.pid) {
      return users.map((user) => ({ user }));
    }

    return this.profileService.findManyUserProfileRelations(users, notification.pid);
  }

  private async getProfileSubscriptionContext(
    notification: Notification<any, ProfileSubscription>,
  ): Promise<UserSubscriptionContext[]> {
    // TODO: This is currently not scalable for profiles with many users, we should split this in batches
    return this.profileService.findAllUserProfileRelations(notification.pid);
  }
}
