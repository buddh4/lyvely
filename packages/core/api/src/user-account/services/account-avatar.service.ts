import { Injectable } from '@nestjs/common';
import { User, UserDao } from '@/users';
import { Avatar, AvatarService, GravatarService } from '@/avatars';

/**
 * AccountAvatarService is responsible for updating avatars for user accounts.
 *
 * @class
 * @public
 * @constructor
 * @param {UserDao} userDao - The data access object for user.
 * @param {AvatarService} avatarService - The service for managing avatars.
 * @param {GravatarService} gravatarService - The service for managing gravatars.
 */
@Injectable()
export class AccountAvatarService {
  constructor(
    private userDao: UserDao,
    private avatarService: AvatarService,
    private gravatarService: GravatarService,
  ) {}

  /**
   * Updates the avatar of a user.
   *
   * @param {User} user - The user for whom to update the avatar.
   * @param {Express.Multer.File} file - The file containing the new avatar image.
   * @returns {Promise<Avatar>} - The newly*/
  async updateAvatar(user: User, file: Express.Multer.File) {
    const avatar = await this.avatarService.createAvatar(user._id, file, user.guid);
    await this.userDao.updateOneSetById(user, { avatar });
    return avatar;
  }

  /**
   * Updates the user Avatar by fetching his Gravatar.
   *
   * @param {User} user - The user object whose Gravatar should be updated.
   * @return {Promise<Avatar>} - A promise that resolves with the updated avatar.
   */
  async updateGravatar(user: User): Promise<Avatar> {
    const avatar = await this.gravatarService.createAvatar(user.email, user.guid);
    await this.userDao.updateOneSetById(user, { avatar });
    return avatar;
  }
}
