import { Injectable } from '@nestjs/common';
import { Avatar } from '../schemas';
import { BaseAvatarService } from './base-avatar.service';
import { STORAGE_BUCKET_AVATARS } from '../avatar.constants';
import type { TObjectId } from '@/core';
import { assureObjectId } from '@/core';
import { FileUpload, type IFileInfo } from '@/files';

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
    await this.storageService.upload(
      new FileUpload({
        file,
        guid: avatar.guid,
        bucket: STORAGE_BUCKET_AVATARS,
        createdBy: assureObjectId(user),
      }),
    );
    return avatar;
  }
}
