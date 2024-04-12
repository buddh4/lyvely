import { Injectable } from '@nestjs/common';
import { Avatar } from '../schemas';
import { BaseAvatarService } from './base-avatar.service';
import { STORAGE_BUCKET_AVATARS } from '../avatar.constants';
import { type TObjectId, variantGuid } from '@/core';
import { assureObjectId } from '@/core';
import { FileUpload, type IFileInfo, ImageTransformationPipe } from '@/files';
import { AVATAR_SIZE, AVATAR_VARIANT_LG } from '@lyvely/interface';

@Injectable()
export class AvatarService extends BaseAvatarService {
  /**
   * Creates an avatar with the given guid or generates a new guid.
   *
   * @param {User} user - the user responsible for creating the avatar.
   * @param {Express.Multer.File} file - The avatar image file.
   * @param {string} guid - An optional GUID for the avatar.
   * @returns {Promise<Avatar>} - A promise that resolves with the updated avatar object.
   */
  async createAvatar(user: TObjectId, file: IFileInfo, guid?: string): Promise<Avatar> {
    const avatar = new Avatar(guid);
    const lgGuid = variantGuid(avatar.guid, AVATAR_VARIANT_LG);

    await Promise.all([
      this.upload(user, file, lgGuid),
      this.transformAndUploadMainAvatar(user, file, avatar.guid),
    ]);

    return avatar;
  }

  /**
   * Uploads the given file with the given guid to storage.
   * @param user
   * @param file
   * @param guid
   * @private
   */
  private async upload(user: TObjectId, file: IFileInfo, guid: string) {
    return this.storageService.upload(
      new FileUpload({
        file,
        guid,
        bucket: STORAGE_BUCKET_AVATARS,
        createdBy: assureObjectId(user),
      }),
    );
  }

  /**
   * Transforms the given file to the main avatar to the storage.
   * @param user
   * @param file
   * @param guid
   * @private
   */
  private async transformAndUploadMainAvatar(user: TObjectId, file: IFileInfo, guid: string) {
    const transformPipe = new ImageTransformationPipe({ maxWidth: AVATAR_SIZE });
    const avatarFileInfo = await transformPipe.transform(file);
    return this.upload(user, avatarFileInfo, guid);
  }
}
