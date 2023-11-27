import { Injectable } from '@nestjs/common';
import { UserDao } from '../daos';
import { OptionalUser, RefreshToken, User, UserNotificationState } from '../schemas';
import { EntityIdentity, IBaseQueryOptions } from '@/core';
import { IntegrityException, UserStatus, ProfileType } from '@lyvely/interface';
import { isEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(private userDao: UserDao) {}

  /**
   * Returns a user by email. Note that this function only searches for the main email addresses
   * and does not respect secondary email addresses. Therefor this can be used for authentication and other
   * identity relevant operations.
   * @param email
   */
  async findUserByMainEmail(email: string): Promise<OptionalUser> {
    if (!email) return null;

    return this.userDao.findByMainEmail(email);
  }

  /**
   * Returns a user by username or email. Note if an email is given this function only searches for the main email addresses
   * and does not respect secondary email addresses. Therefor this can be used for authentication and other
   * identity relevant operations.
   * @param usernameOrEmail Either a username or an email
   */
  async findUserByUsernameOrMainEmail(usernameOrEmail: string): Promise<OptionalUser> {
    if (!usernameOrEmail) return null;

    if (isEmail(usernameOrEmail)) return this.findUserByMainEmail(usernameOrEmail);
    else return this.userDao.findByUsername(usernameOrEmail);
  }

  async findUsersByVerifiedEmails(emails: string[]): Promise<User[]> {
    return this.userDao.findByVerifiedEmails(emails);
  }

  async findByVerifiedEmail(email: string): Promise<OptionalUser> {
    return this.userDao.findByVerifiedEmail(email);
  }

  /**
   * Returns a single user with the given id or null.
   * @param id
   */
  async findUserById(id: EntityIdentity<User>): Promise<OptionalUser> {
    if (!id) {
      return null;
    }

    return await this.userDao.findById(id);
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
