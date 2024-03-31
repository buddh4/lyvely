import { Avatar, AvatarService } from '@/avatars';
import { Injectable } from '@nestjs/common';
import type { ProfileMembershipContext } from '../models';
import { ProfileDao } from '../daos';

@Injectable()
export class ProfileAvatarService {
  constructor(
    private readonly profileDao: ProfileDao,
    private readonly avatarService: AvatarService,
  ) {}

  /**
   * Updates the avatar of a profile.
   *
   * @param {ProfileMembershipContext} context - The context object containing information about the user's profile.
   * @param {Express.Multer.File} file - The avatar image file to update.
   *
   * @returns {Promise<Avatar>} - A promise that resolves with the updated avatar object.
   */
  async updateAvatar(
    context: ProfileMembershipContext,
    file: Express.Multer.File,
  ): Promise<Avatar> {
    const { profile } = context;
    const avatar = await this.avatarService.createAvatar(file, profile.guid);
    await this.profileDao.updateOneSetById(profile, { avatar });
    return avatar;
  }
}
