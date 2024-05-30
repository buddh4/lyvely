import { Injectable } from '@nestjs/common';
import type { ProfileMembershipContext } from '../models';
import { Avatar, AvatarService, GravatarService } from '@/avatars';
import { MembershipsDao } from '../daos';
import type { IFileInfo } from '@/files';

@Injectable()
export class ProfileMembershipAvatarService {
  constructor(
    private readonly membershipDao: MembershipsDao,
    private readonly avatarService: AvatarService,
    private readonly gravatarService: GravatarService
  ) {}
  /**
   * Updates the avatar of a profile membership.
   *
   * @param {ProfileMembershipContext} context - The context of the user profile membership.
   * @param {Express.Multer.File} file - The file containing the new avatar image.
   * @returns {Avatar} - The updated avatar object.
   */
  async updateAvatar(context: ProfileMembershipContext, file: IFileInfo) {
    const { user } = context;
    const oldGuid = context.getMembership().userInfo.guid;
    const avatar = await this.avatarService.createAvatar(user._id, file);
    await Promise.any([
      this.updateUserInfoAvatar(context, avatar),
      this.avatarService.deleteAvatar(oldGuid),
    ]);
    return avatar;
  }

  /**
   * Updates the Avatar of a profile membership with his Gravatar.
   *
   * @param {ProfileMembershipContext} context - The context object containing user information.
   * @return {Promise<Avatar>} A promise that resolves with the updated avatar.
   */
  async updateGravatar(context: ProfileMembershipContext): Promise<Avatar> {
    // TODO: Gravatar should only be allowed for verified emails (at the moment the default email is verified)
    const { user } = context;
    const oldGuid = context.getMembership().userInfo.guid;
    const avatar = await this.gravatarService.createAvatar(
      context.getMembership().userInfo.email || user.email
    );

    await Promise.any([
      this.updateUserInfoAvatar(context, avatar),
      this.gravatarService.deleteAvatar(oldGuid),
    ]);

    return avatar;
  }

  /**
   * Updates the avatar of the user's profile.
   *
   * @param {ProfileMembershipContext} context - The membership context of the user's profile.
   * @param {Avatar} avatar - The new avatar to update.
   * @private
   * @returns {Promise<void>} - A promise that resolves when the avatar update is complete.
   */
  private async updateUserInfoAvatar(context: ProfileMembershipContext, avatar: Avatar) {
    return this.membershipDao.updateOneSetById(context.getMembership(), {
      'userInfo.guid': avatar.guid,
    });
  }
}
