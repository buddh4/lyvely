import { AbstractDao, EntityIdentity } from '@/core';
import { UserInvite } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users';
import { subtractDays } from '@lyvely/common';

export class UserInviteDao extends AbstractDao<UserInvite> {
  @InjectModel(UserInvite.name)
  protected model: Model<UserInvite>;

  countInvitesByUserThisWeek(user: EntityIdentity<User>) {
    return this.model.count({
      updatedAt: { $gte: subtractDays(new Date(), 7) },
    });
  }

  getModelConstructor() {
    return UserInvite;
  }

  getModuleId(): string {
    return 'user-invites';
  }
}
