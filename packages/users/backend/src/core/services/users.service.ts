import { Injectable } from '@nestjs/common';
import { UserDao } from '../daos';
import { RefreshToken, User, UserNotificationState } from '../schemas';
import { ProfileType, IntegrityException, UserStatus } from '@lyvely/common';
import { EntityIdentity, IBaseQueryOptions } from '@lyvely/core';

@Injectable()
export class UsersService {
  constructor(private userDao: UserDao) {}

  /**
   * Returns a user by email. Note that this function only searches for the main email addresses
   * and does not respect secondary email addresses. Therefor this can be used for authentication and other
   * identity relevant operations.
   * @param email
   */
  async findUserByMainEmail(email: string): Promise<User | null> {
    if (!email) return null;

    return this.userDao.findByMainEmail(email);
  }

  async findUsersByVerifiedEmails(emails: string[]): Promise<User[]> {
    if (!emails?.length) return [];

    return this.userDao.findByVerifiedEmails(emails);
  }

  async findByVerifiedEmail(email: string): Promise<User | null> {
    if (!email) return null;

    return this.userDao.findByVerifiedEmail(email);
  }

  /**
   * Returns a single user with the given id or null.
   * @param id
   */
  async findUserById(id: EntityIdentity<User>): Promise<User | null> {
    if (!id) {
      return null;
    }

    return this.userDao.findById(id);
  }

  async findUsersById(ids: EntityIdentity<User>[]): Promise<User[]> {
    if (!ids?.length) {
      return [];
    }

    return this.userDao.findAllByIds(ids);
  }

  async incrementProfileCount(owner: User, type: ProfileType, options?: IBaseQueryOptions) {
    return this.userDao.incrementProfileCount(owner, type, 1, options);
  }

  async decrementProfileCount(owner: User, type: ProfileType, options?: IBaseQueryOptions) {
    return this.userDao.incrementProfileCount(owner, type, -1, options);
  }

  async setRefreshToken(user: User, token: RefreshToken) {
    if (!token.vid) {
      throw new IntegrityException('Can not set refresh-token without vid');
    }

    if (user.getRefreshTokenByVisitorId(token.vid)) {
      await this.userDao.updateRefreshToken(user, token);
    } else {
      await this.userDao.createRefreshToken(user, token, 20);
    }
  }

  async destroyRefreshToken(user: User, visitorId: string) {
    return this.userDao.destroyRefreshToken(user, visitorId);
  }

  async destroyExpiredRefreshTokens(user: User) {
    return this.userDao.destroyExpiredRefreshTokens(user);
  }

  async setUserStatus(user: EntityIdentity<User>, status: UserStatus) {
    return this.userDao.updateOneSetById(user, { status: status });
  }

  async updateNotificationState(user: EntityIdentity<User>, notification: UserNotificationState) {
    return this.userDao.updateOneSetById(user, { notification });
  }

  async updateNotificationUpdateState(identity: EntityIdentity<User>, state: boolean) {
    if (identity instanceof User && identity.notification.updatesAvailable === state) return true;

    return this.userDao.updateOneSetById(identity, {
      'notification.updatesAvailable': state,
    });
  }

  async setUserPassword(user: EntityIdentity<User>, newPassword: string, resetSession: boolean) {
    return this.userDao.updatePassword(user, newPassword, resetSession);
  }
}
