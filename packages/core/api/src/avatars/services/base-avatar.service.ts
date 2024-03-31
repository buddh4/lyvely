import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { getLocalUploadFilePath } from '@/files';
import fs from 'fs/promises';
import { isGuid } from '@lyvely/common';
import { IntegrityException } from '@lyvely/interface';
import { Inject } from '@nestjs/common';

/**
 * Base class for services responsible for creating avatars.
 */
export abstract class BaseAvatarService {
  @Inject()
  protected configService: ConfigService;

  /**
   * Deletes an avatar file associated with the given GUID, if exists.
   *
   * @param {string} guid - The GUID of the avatar to delete.
   * @throws {IntegrityException} - If an invalid guid was provided.
   * @return {Promise<void>} - A promise that resolves when the avatar file is deleted.
   */
  async deleteAvatar(guid: string): Promise<void> {
    if (!guid) return;
    const avatarFilePath = this.getAvatarFilePath(guid);
    if (existsSync(avatarFilePath)) {
      await fs.unlink(avatarFilePath);
    }
  }

  /**
   * Retrieves the file path for the avatar with the given GUID.
   *
   * @param {string} guid - The GUID of the avatar.
   * @throws {IntegrityException} - If an invalid guid was provided.
   * @protected
   * @returns {string} The file path for the avatar.
   */
  protected getAvatarFilePath(guid: string) {
    if (!isGuid(guid)) throw new IntegrityException(`Invalid avatar guid: '${guid}'`);

    const avatarDirPath = getLocalUploadFilePath(this.configService, 'avatars');
    if (!existsSync(avatarDirPath)) {
      mkdirSync(avatarDirPath, { recursive: true });
    }

    return getLocalUploadFilePath(this.configService, 'avatars', guid);
  }
}
