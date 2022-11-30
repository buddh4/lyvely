import { Injectable } from '@nestjs/common';
import { User, UsersService } from '@/users';
import { ProfileMembershipService } from '@/profiles/services/profile-membership.service';
import { Notification } from '../schemas';
import { chunkArray } from '@lyvely/common';
import { Membership } from '@/profiles';

@Injectable()
export class NotificationSubscriptionService {
  constructor(
    private userService: UsersService,
    private profileMemberService: ProfileMembershipService,
  ) {}

  async getProfileSubscriptions(
    notification: Notification,
    batchSize = 100,
  ): Promise<Array<Membership[]>> {
    if (!notification.subscription.pid) return [];

    const memberships = await this.profileMemberService.getMemberShips(
      notification.subscription.pid,
    );

    return chunkArray(memberships, batchSize);
  }

  async getUserSubscriptions(notification: Notification): Promise<Array<User>> {
    if (!notification.subscription.uids?.length) {
      return [];
    }

    return this.userService.findUserByIds(notification.subscription.uids);
  }
}
