import { Injectable } from '@nestjs/common';
import { User } from './schemas/users.schema';
import { UserDao } from './daos/user.dao';
import { RefreshToken } from './schemas/refresh.tokens.schema';

@Injectable()
export class UsersService {
  constructor(
    private userDao: UserDao,
  ) {}

  /**
   * Returns a user by their unique username or null.
   *
   * @param {string} username of user, not case sensitive
   * @returns {(User)}
   * @memberof UsersService
   */
  async findUserByUsername(username: string): Promise<User | null> {
    if(!username) {
      return null;
    }

    return this.userDao.findByUsername(username);
  }

  /**
   * Returns a single user with the given id or null.
   * @param id
   */
  async findUserById(id: string): Promise<User | null> {
    if(!id) {
      return null;
    }

    return this.userDao.findById(id);
  }

  async setVisitorRefreshTokenHash(user: User, visitorId: string, token: RefreshToken) {
    // TODO: check if the user already has a token with the given vid, then either create or updae one
    if(user.getRefreshTokenByVisitorId(visitorId)) {
      await this.userDao.updateRefreshToken(user, token);
    } else {
      await this.userDao.createRefreshToken(user, token);
    }
  }

  async destroyRefreshToken(user: User, visitorId: string) {
    await this.userDao.destroyRefreshToken(user, visitorId);
  }
}
