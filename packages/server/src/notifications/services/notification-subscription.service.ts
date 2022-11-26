import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users';
import { ProfileMembershipService } from '@/profiles/services/profile-membership.service';
import { Notification } from '../schemas';
import { chunkArray } from '@lyvely/common';

@Injectable()
export class NotificationSubscriptionService {
  constructor(private userService: UsersService, private profileMemberService: ProfileMembershipService) {}

  async getUserIds(notification: Notification): Promise<Array<TObjectId>> {
    const result = notification.subscription.uids || [];
    if (notification.subscription.pid) {
      const memberships = await this.profileMemberService.getMemberShips(notification.subscription.pid);
      memberships.forEach((membership) => result.push(membership.uid));
    }

    return result;
  }

  async getUserIdBatches(notification: Notification, batchSize = 100): Promise<Array<TObjectId[]>> {
    return chunkArray(await this.getUserIds(notification), batchSize);
  }
}
