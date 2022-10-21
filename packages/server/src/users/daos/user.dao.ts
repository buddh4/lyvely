import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, RefreshToken, UserEmail } from '../schemas';
import { AbstractDao, IBaseQueryOptions, EntityIdentity, assureObjectId } from '@/core';
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

  /**
   * Note a secondary email may be part of multiple user accounts, but is only verified
   * @param email
   */
  async findByAnyEmail(email: string): Promise<User[]> {
    return this.findAll({ $or: [{ email: email.toLowerCase() }, { 'emails.lowercaseEmail': email.toLowerCase() }] });
  }

  async setEmailVerification(user: EntityIdentity<User>, email: string, verification = true) {
    const result = await this.updateOneByFilter(
      user,
      { $set: { 'emails.$[userEmail]': new UserEmail(email, verification) } },
      {},
      {
        arrayFilters: [{ 'userEmail.lowercaseEmail': email.toLowerCase() }],
      },
    );

    if (user instanceof User && user.getUserEmail(email)) {
      user.getUserEmail(email).verified = verification;
    }

    return result;
  }

  async removeEmail(user: EntityIdentity<User>, email: string) {
    const result = await this.updateOneById(user, { $pull: { emails: { lowercaseEmail: email.toLowerCase() } } });

    if (user instanceof User) {
      user.emails = user.emails.filter((userEmail) => userEmail.lowercaseEmail !== email.toLowerCase());
    }

    return result;
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
    return !!(await this.updateOneById(identity, {
      $push: {
        refreshTokens: new RefreshToken({
          vid: token.vid,
          hash: token.hash,
          expiration: token.expiration,
          remember: token.remember,
        }),
      },
    }));
  }

  async updateRefreshToken(identity: EntityIdentity<User>, token: RefreshToken) {
    const result = await this.updateOneByFilter(
      identity,
      {
        $set: {
          'refreshTokens.$.hash': token.hash,
          'refreshTokens.$.expiration': token.expiration,
        },
      },
      { 'refreshTokens.vid': token.vid },
    );

    // This is required since we do not support automatic $set updates of array elements
    if (result && identity instanceof User) {
      const currentToken = identity.getRefreshTokenByVisitorId(token.vid);
      if (currentToken) {
        currentToken.hash = token.hash;
        currentToken.expiration = token.expiration;
      }
    }

    return result;
  }

  async destroyRefreshToken(identity: EntityIdentity<User>, vid: string) {
    const result = await this.updateOneById(identity, {
      $pull: {
        refreshTokens: { vid: vid },
      },
    });

    // This is required since we do not support automatic $pull modifications
    if (result && identity instanceof User) {
      identity.refreshTokens = identity.refreshTokens.filter((token) => token.vid !== vid);
    }

    return result;
  }

  getModelConstructor(): Constructor<User> {
    return User;
  }

  getModuleId(): string {
    return 'users';
  }

  pushEmail(user: EntityIdentity<User>, userEmail: UserEmail) {
    return this.updateOneById(user, { $push: { emails: userEmail } });
  }
}
