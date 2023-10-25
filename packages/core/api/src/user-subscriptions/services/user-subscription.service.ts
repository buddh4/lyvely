import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users';
import {
  UserSubscription,
  ProfileSubscription,
  SingleUserSubscription,
  MultiUserSubscription,
} from '../schemas';
import { UserSubscriptionContext } from '../interfaces';
import {
  IUserWithProfileRelation,
  Profile,
  ProfileRelationsService,
  ProfilesService,
} from '@/profiles';
import { EntityIdentity } from '@/core';
import { IntegrityException } from '@lyvely/common';

@Injectable()
export class UserSubscriptionService {
  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private profileRelationsService: ProfileRelationsService,
  ) {}

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
        if (!pid) return [];
        return this.getProfileSubscriptionContext(pid);
    }

    return [];
  }

  private async getSingleUserSubscriptionContext(
    subscription: SingleUserSubscription,
    pid?: EntityIdentity<Profile>,
  ): Promise<UserSubscriptionContext[]> {
    if (!subscription.uid)
      throw new IntegrityException('SingleUserSubscription without uid requested.');
    const user = await this.usersService.findUserById(subscription.uid);

    if (!user) return [];
    if (!pid) return [{ user }];

    const context = await this.profilesService.findProfileContext(user, pid);

    return [this.profileContextToSubscriptionContext(context)];
  }

  private async getMultiUserSubscriptionContext(
    subscription: MultiUserSubscription,
    pid?: EntityIdentity<Profile>,
  ): Promise<UserSubscriptionContext[]> {
    if (!subscription?.uids?.length) return [];

    const users = await this.usersService.findUsersById(subscription.uids);

    if (!users?.length) return [];
    if (!pid) {
      return users.map((user) => ({ user }));
    }

    const contexts = await this.profilesService.findProfileContextsByUsers(pid, users);
    return contexts.map((c) => this.profileContextToSubscriptionContext(c));
  }

  private profileContextToSubscriptionContext(
    ctx: IUserWithProfileRelation,
  ): UserSubscriptionContext {
    const { user, profile, relations } = ctx;
    return { user, profile, profileRelations: relations };
  }

  private async getProfileSubscriptionContext(
    pid: EntityIdentity<Profile>,
  ): Promise<UserSubscriptionContext[]> {
    if (!pid) return [];

    // TODO: This is currently not scalable for profiles with many users, we should split this in batches
    const contexts = await this.profileRelationsService.findAllUserProfileRelations(pid);
    return contexts.map((c) => this.profileContextToSubscriptionContext(c));
  }
}
