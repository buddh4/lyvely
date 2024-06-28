import {
  AbstractDao,
  Dao,
  DocumentIdentity,
  FilterQuery,
  UpdateOptions,
  UpdateQuerySet,
} from '@/core';
import { RefreshToken, User, UserEmail } from '../schemas';
import { ProfileType } from '@lyvely/interface';
import { TenancyIsolation } from '@/core/tenancy';
import { LegacyLocaleTransformation } from '../schemas/transformations';

/**
 * Data Access Object for accessing user entities.
 */
@Dao(User, { isolation: TenancyIsolation.Strict })
export class UserDao extends AbstractDao<User> {
  constructor() {
    super();
    this.registerTransformations(new LegacyLocaleTransformation());
  }
  /**
   * Finds a user by their username in a case-insensitive manner.
   * @param username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne(
      { username: username.toLowerCase() },
      {
        collation: {
          locale: 'en',
          strength: 1,
        },
      }
    );
  }

  /**
   * Finds a user by their main email address, considering case-insensitivity.
   * @param email
   */
  async findByMainEmail(email: string): Promise<User | null> {
    const matches = await this.findByAnyEmail(email);
    return matches.reduce((result: User | null, user) => {
      if (result) return result;
      if (user.email.toLowerCase() === email.toLowerCase()) return user;
      else return null;
    }, null);
  }

  /**
   * Finds all users with a certain secondary or primary email, considering case-insensitivity.
   * Note, a secondary email may be part of multiple user accounts, but can only be verified by one account.
   * @param email
   */
  async findByAnyEmail(email: string): Promise<User[]> {
    return this.findAll(
      { 'emails.email': email },
      {
        collation: {
          locale: 'en',
          strength: 1,
        },
      }
    );
  }

  /**
   * Finds all users related with one of the given emails either as secondary or primary email, considering case-insensitivity.
   * @param emails
   */
  async findByAnyEmails(emails: string[]): Promise<User[]> {
    return this.findAll(
      { 'emails.email': { $in: emails } },
      {
        collation: {
          locale: 'en',
          strength: 1,
        },
      }
    );
  }

  /**
   * Finds a user with the given verified email address, considering case-insensitivity.
   * @param email
   * @param includeUnverifiedMain
   */
  async findByVerifiedEmail(email: string, includeUnverifiedMain = false): Promise<User | null> {
    const query: FilterQuery<User> = { 'emails.email': email };

    const users = await this.findAll(query, {
      collation: {
        locale: 'en',
        strength: 1,
      },
    });

    return users.reduce((result: null | User, user) => {
      if (result) return result;
      if (user.getVerifiedUserEmail(email)) return user;
      if (includeUnverifiedMain && user.email.toLowerCase() === email.toLowerCase()) return user;
      return null;
    }, null);
  }

  /**
   * Finds all users with the given verified email addresses, considering case-insensitivity.
   * @param emails
   */
  async findByVerifiedEmails(emails: string[]): Promise<User[]> {
    if (!emails.length) return [];

    const query: FilterQuery<User> = {
      'emails.email': { $in: emails },
      'emails.verified': true,
    };

    return this.findAll(query, {
      collation: {
        locale: 'en',
        strength: 1,
      },
    });
  }

  /**
   * Finds users with the given unverified email. Note that an unverified emails may be attached to multiple accounts,
   * considering case-insensitivity.
   * Note, this does not check if the email is verified for another account.
   * @param email
   */
  async findByUnverifiedEmail(email: string): Promise<User[]> {
    return this.findAll(
      { 'emails.email': email, 'emails.verified': false },
      {
        collation: {
          locale: 'en',
          strength: 1,
        },
      }
    );
  }

  /**
   * Find all users which are related to one of the given unverified emails, considering case-insensitivity.
   * Note, this does not check if the emails are verified for another account.
   * @param emails
   */
  async findByUnverifiedEmails(emails: string[]): Promise<User[]> {
    if (!emails.length) return [];

    return this.findAll(
      { 'emails.email': { $in: emails }, 'emails.verified': false },
      {
        collation: {
          locale: 'en',
          strength: 1,
        },
      }
    );
  }

  /**
   * Sets the verification status of an already registered email for the given user, considering case-insensitivity.
   * @param user
   * @param email
   * @param verification
   */
  async setEmailVerification(user: DocumentIdentity<User>, email: string, verification = true) {
    const result = await this.updateOneByFilter(
      user,
      { $set: { 'emails.$[userEmail]': new UserEmail(email, verification) } },
      {},
      {
        arrayFilters: [{ 'userEmail.email': email }],
        collation: {
          locale: 'en',
          strength: 1,
        },
      }
    );

    if (user instanceof User && user.getUserEmail(email)) {
      user.getUserEmail(email)!.verified = verification;
    }

    return result;
  }

  /**
   * Removes an email from the given user, considering case-insensitivity.
   * @param user
   * @param email
   */
  async removeEmail(user: DocumentIdentity<User>, email: string) {
    const result = await this.updateOneById(
      user,
      {
        $pull: { emails: { email: email } },
      },
      {
        collation: {
          locale: 'en',
          strength: 1,
        },
      }
    );

    if (user instanceof User) {
      user.emails = user.emails.filter(
        (userEmail) => userEmail.email.toLowerCase() !== email.toLowerCase()
      );
    }

    return result;
  }

  async incrementProfileCount(
    user: User,
    type: ProfileType,
    amount = 1,
    options?: UpdateOptions<User>
  ) {
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

  async createRefreshToken(identity: DocumentIdentity<User>, token: RefreshToken, limit = 20) {
    const tokenModel = new RefreshToken({
      vid: token.vid,
      hash: token.hash,
      expiration: token.expiration,
      remember: token.remember,
    });

    return await this.updateOneById(identity, {
      $push: {
        refreshTokens: {
          $each: [tokenModel],
          $sort: { updatedAt: 1 },
          $slice: -limit,
        },
      },
    });
  }

  async updateRefreshToken(identity: DocumentIdentity<User>, token: RefreshToken) {
    const result = await this.updateOneByFilter(
      identity,
      {
        $set: {
          'refreshTokens.$.hash': token.hash,
          'refreshTokens.$.expiration': token.expiration,
        },
      },
      { 'refreshTokens.vid': token.vid }
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

  async destroyRefreshToken(identity: DocumentIdentity<User>, vid: string) {
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

  async destroyExpiredRefreshTokens(identity: DocumentIdentity<User>) {
    const now = new Date();
    const result = await this.updateOneById(identity, {
      $pull: {
        refreshTokens: { expiration: { $lt: now } },
      },
    });

    // This is required since we do not support automatic $pull modifications
    if (result && identity instanceof User) {
      identity.refreshTokens = identity.refreshTokens.filter((token) => token.expiration > now);
    }

    return result;
  }

  async updatePassword(
    identity: DocumentIdentity<User>,
    newPassword: string,
    resetSession: boolean
  ) {
    const date = new Date();
    const update = { password: newPassword, passwordResetAt: date } as UpdateQuerySet<User>;
    if (resetSession) {
      update!.sessionResetAt = date;
    }

    // This is currently required since the password hash is generated in pre hooks which is not supported by our abstract.dao update assignment
    const user = await this.findOneAndSetById(identity, update);
    if (!user) return false;
    if (identity instanceof User) {
      identity.password = user.password;
    }
    return true;
  }

  pushEmail(user: DocumentIdentity<User>, userEmail: UserEmail) {
    return this.updateOneById(user, { $push: { emails: userEmail } });
  }
}
