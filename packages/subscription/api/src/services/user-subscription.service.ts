import { Injectable } from '@nestjs/common';
import { UsersService } from '@lyvely/users';
import {
  UserSubscription,
  ProfileSubscription,
  SingleUserSubscription,
  MultiUserSubscription,
} from '../schemas';
import { UserSubscriptionContext } from '../interfaces';
import { Profile, ProfilesService } from '@lyvely/profiles';
import { EntityIdentity } from '@lyvely/core';

@Injectable()
export class UserSubscriptionService {
  constructor(private userService: UsersService, private profileService: ProfilesService) {}

  async getSubscriptionContext(
    subscription: UserSubscription,
    pid?: EntityIdentity<Profile>,
  ): Promise<Array<UserSubscriptionContext>> {
    switch (subscription.type) {
      case SingleUserSubscription.typeName:
        return this.getSingleUserSubscriptionContext(subscription, pid);
      case MultiUserSubscription.typeName:
        return this.getMultiUserSubscriptionContext(subscription, pid);
      case ProfileSubscription.typeName:
        return this.getProfileSubscriptionContext(pid);
    }

    return [];
  }

  private async getSingleUserSubscriptionContext(
    subscription: SingleUserSubscription,
    pid?: EntityIdentity<Profile>,
  ): Promise<UserSubscriptionContext[]> {
    const user = await this.userService.findUserById(subscription.uid);

    if (!user) return [];
    if (!pid) return [{ user }];

    return [await this.profileService.findUserProfileRelations(user, pid)];
  }

  private async getMultiUserSubscriptionContext(
    subscription: MultiUserSubscription,
    pid?: EntityIdentity<Profile>,
  ): Promise<UserSubscriptionContext[]> {
    const users = await this.userService.findUsersById(subscription.uids);

    if (!users?.length) return [];
    if (!pid) {
      return users.map((user) => ({ user }));
    }

    return this.profileService.findManyUserProfileRelations(pid, users);
  }

  private async getProfileSubscriptionContext(
    pid: EntityIdentity<Profile>,
  ): Promise<UserSubscriptionContext[]> {
    if (!pid) return [];
    // TODO: This is currently not scalable for profiles with many users, we should split this in batches
    return this.profileService.findAllUserProfileRelations(pid);
  }
}
