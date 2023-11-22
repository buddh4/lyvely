import { Injectable } from '@nestjs/common';
import { User, UserDao } from '@/users';
import { Avatar } from '@/avatars';
import { ConfigService } from '@nestjs/config';
import fs from 'fs/promises';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import crypto from 'crypto';
import { getLocalUploadFilePath } from '@/files';
import client from 'https';
import { ConfigurationPath } from '@/config';
import { isGuid, IntegrityException } from '@lyvely/common';

@Injectable()
export class AccountAvatarService {
  constructor(private userDao: UserDao, private configService: ConfigService<ConfigurationPath>) {}

  async updateAvatar(user: User, file: Express.Multer.File) {
    if (!isGuid(user.guid)) throw new IntegrityException(`Invalid user guid for user '${user.id}'`);

    await fs.writeFile(this.getAccountAvatarFilePath(user), file.buffer);
    const avatar = new Avatar(user.guid);
    await this.userDao.updateOneSetById(user, { avatar: new Avatar(user.guid) });
    return avatar;
  }

  async updateGravatar(user: User): Promise<Avatar> {
    if (!isGuid(user.guid)) throw new IntegrityException(`Invalid user guid for user '${user.id}'`);

    const hash = crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex');
    const gravatarUrl = `https://s.gravatar.com/avatar/${hash}?s=64`;

    return new Promise((resolve, reject) => {
      client.get(gravatarUrl, (res) => {
        const stream = createWriteStream(this.getAccountAvatarFilePath(user));
        res.pipe(stream);
        stream.on('error', reject);
        stream.on('finish', async () => {
          const avatar = new Avatar(user.guid);
          await this.userDao.updateOneSetById(user, { avatar: new Avatar(user.guid) });
          resolve(avatar);
        });
      });
    });
  }

  private getAccountAvatarFilePath(user: User) {
    // TODO: Move to avatar module
    this.ensureAvatarDirExists();
    return getLocalUploadFilePath(this.configService, 'avatars', user.guid);
  }

  private ensureAvatarDirExists(): void {
    const avatarDirPath = getLocalUploadFilePath(this.configService, 'avatars');
    if (!existsSync(avatarDirPath)) {
      mkdirSync(avatarDirPath, { recursive: true });
    }
  }
}