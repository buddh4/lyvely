import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, RefreshToken } from '../schemas';
import { AbstractDao, IBaseQueryOptions, assureObjectId, EntityIdentity } from '@/modules/core';
import { Constructor, ProfileType } from '@lyvely/common';

@Injectable()
export class UserDao extends AbstractDao<User> {
  constructor(@InjectModel(User.name) protected model: Model<UserDocument>) {
    super();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ lowercaseUsername: username.toLowerCase() });
  }

  async findByMainEmail(email: string): Promise<User | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByAnyEmail(email: string): Promise<User | null> {
    return this.findOne({ 'emails.lowercaseEmail': email.toLowerCase() });
  }

  async incrementProfileCount(user: User, type: ProfileType, amount = 1, options?: IBaseQueryOptions) {
    let path = 'profilesCount.';
    let count;

    if (type === ProfileType.Organization) {
      path += 'organization';
      count = user.profilesCount.organization + amount;
    } else if (type === ProfileType.Group) {
      path += 'group';
      count = user.profilesCount.group + amount;
    } else {
      path += 'user';
      count = user.profilesCount.user + amount;
    }

    return this.updateOneSetById(user, { [path]: Math.max(0, count) }, options);
  }

  async createRefreshToken(identity: EntityIdentity<User>, token: RefreshToken) {
    this.updateOneById(identity, {});
    return !!(await this.updateOneById(identity, {
      $push: {
        refreshTokens: new RefreshToken({
          vid: token.vid,
          hash: token.hash,
          expiration: token.expiration,
        }),
      },
    }));
  }

  async updateRefreshToken(identity: EntityIdentity<User>, token: RefreshToken): Promise<boolean> {
    return !!(
      await this.model.updateOne(
        { _id: assureObjectId(identity), 'refreshTokens.vid': token.vid },
        {
          $set: {
            'refreshTokens.$.hash': token.hash,
            'refreshTokens.$.expiration': token.expiration,
          },
        },
      )
    ).modifiedCount;
  }

  async destroyRefreshToken(identity: EntityIdentity<User>, visitorId: string) {
    return this.model.findByIdAndUpdate(assureObjectId(identity), {
      $pull: {
        refreshTokens: { vid: visitorId },
      },
    });
  }

  getModelConstructor(): Constructor<User> {
    return User;
  }

  getModuleId(): string {
    return 'users';
  }
}
