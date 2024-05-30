import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users';
import {
  UserSubscription,
  SingleUserSubscription,
  MultiUserSubscription,
  isSingleUserSubscription,
  isMultiUserSubscription,
  isProfileUserSubscription,
} from '../schemas';
import { IUserSubscriptionContext } from '../interfaces';
import {
  IUserWithProfileRelation,
  Profile,
  ProfileRelationsService,
  ProfilesService,
} from '@/profiles';
import { DocumentIdentity } from '@/core';
import { IntegrityException } from '@lyvely/interface';

@Injectable()
export class UserSubscriptionService {
  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private profileRelationsService: ProfileRelationsService
  ) {}

  async getSubscriptionContext(
    subscription: UserSubscription,
    pid?: DocumentIdentity<Profile>
  ): Promise<Array<IUserSubscriptionContext>> {
    if (isSingleUserSubscription(subscription)) {
      return this.getSingleUserSubscriptionContext(subscription, pid);
    }

    if (isMultiUserSubscription(subscription)) {
      return this.getMultiUserSubscriptionContext(subscription, pid);
    }

    if (isProfileUserSubscription(subscription)) {
      if (!pid) return [];
      return this.getProfileSubscriptionContext(pid);
    }

    return [];
  }

  private async getSingleUserSubscriptionContext(
    subscription: SingleUserSubscription,
    pid?: DocumentIdentity<Profile>
  ): Promise<IUserSubscriptionContext[]> {
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
    pid?: DocumentIdentity<Profile>
  ): Promise<IUserSubscriptionContext[]> {
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
    ctx: IUserWithProfileRelation
  ): IUserSubscriptionContext {
    const { user, profile, relations } = ctx;
    return { user, profile, profileRelations: relations };
  }

  private async getProfileSubscriptionContext(
    pid: DocumentIdentity<Profile>
  ): Promise<IUserSubscriptionContext[]> {
    if (!pid) return [];

    // TODO: This is currently not scalable for profiles with many users, we should split this in batches
    const contexts = await this.profileRelationsService.findAllUserProfileRelations(pid);
    return contexts.map((c) => this.profileContextToSubscriptionContext(c));
  }
}
