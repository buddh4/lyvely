import { ConfigService } from '@nestjs/config';
import { StorageService } from '@/files';
import { Inject } from '@nestjs/common';
import { STORAGE_BUCKET_AVATARS } from '../avatar.constants';
import { DEFAULT_REGION } from '@/core';

/**
 * Base class for services responsible for creating avatars.
 */
export abstract class BaseAvatarService {
  @Inject()
  protected configService: ConfigService;

  @Inject()
  protected storageService: StorageService;

  /**
   * Deletes an avatar file associated with the given GUID, if exists.
   *
   * @param {string} guid - The GUID of the avatar to delete.
   * @throws {IntegrityException} - If an invalid guid was provided.
   * @return {Promise<void>} - A promise that resolves when the avatar file is deleted.
   */
  async deleteAvatar(guid: string): Promise<void> {
    return this.storageService.delete({
      bucket: STORAGE_BUCKET_AVATARS,
      guid: guid,
      region: DEFAULT_REGION,
    });
  }
}
