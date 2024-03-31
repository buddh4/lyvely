import { Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import { Avatar } from '../schemas';
import { BaseAvatarService } from './base-avatar.service';

@Injectable()
export class AvatarService extends BaseAvatarService {
  /**
   * Creates an avatar with the given guid or generates a new guid.
   *
   * @param {Express.Multer.File} file - The avatar image file.
   * @param {string} guid - An optional GUID for the avatar.
   * @returns {Promise<Avatar>} - A promise that resolves with the updated avatar object.
   */
  async createAvatar(file: Express.Multer.File, guid?: string): Promise<Avatar> {
    const avatar = new Avatar(guid);
    await fs.writeFile(this.getAvatarFilePath(avatar.guid), file.buffer);
    return avatar;
  }
}
