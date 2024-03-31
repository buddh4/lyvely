import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync } from 'node:fs';
import { BaseAvatarService } from './base-avatar.service';
import { Avatar } from '../schemas';
import client from 'node:https';
import crypto from 'node:crypto';

@Injectable()
export class GravatarService extends BaseAvatarService {
  /**
   * Creates a Gravatar avatar for the specified email address.
   *
   * @param {string} email - The email address associated with the Gravatar avatar.
   * @param {string} [guid] - Optional GUID to assign to the created avatar.
   * @return {Promise<Avatar>} - A Promise that resolves with the created Avatar object.
   */
  async createAvatar(email: string, guid?: string): Promise<Avatar> {
    const avatar = new Avatar(guid);

    return new Promise((resolve, reject) => {
      client.get(this.buildGravatarUrl(email), (res) => {
        const stream = createWriteStream(this.getAvatarFilePath(avatar.guid));
        res.pipe(stream);
        stream.on('error', reject);
        stream.on('finish', async () => {
          resolve(avatar);
        });
      });
    });
  }

  /**
   * Builds a Gravatar URL based on the given email.
   *
   * @param {string} email - The email address to generate a Gravatar URL for.
   * @private
   * @return {string} The Gravatar URL.
   */
  private buildGravatarUrl(email: string) {
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    return `https://s.gravatar.com/avatar/${hash}?s=64`;
  }
}
