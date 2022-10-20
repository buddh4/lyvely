import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDao } from '../daos';
import { RefreshToken, User, UserEmail } from '../schemas';
import { ProfileType, IntegrityException, UserStatus } from '@lyvely/common';
import { EntityIdentity, IBaseQueryOptions } from '@/core';
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
    if (!email) {
      return null;
    }

    return this.userDao.findByMainEmail(email);
  }

  async findUserByAnyEmail(email: string): Promise<User[]> {
    if (!email) {
      return null;
    }

    return this.userDao.findByAnyEmail(email);
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
      await this.userDao.createRefreshToken(user, token);
    }
  }

  async destroyRefreshToken(user: User, visitorId: string) {
    return this.userDao.destroyRefreshToken(user, visitorId);
  }

  async setUserStatus(user: EntityIdentity<User>, status: UserStatus) {
    return this.userDao.updateOneSetById(user, { status: status });
  }
}
