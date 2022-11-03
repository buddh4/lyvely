import { Injectable } from '@nestjs/common';
import { Avatar, User, UserDao } from '@/users';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import crypto from 'crypto';
import { getLocalFilePath } from '@/files/file-path.utils';
import client from 'https';

@Injectable()
export class AccountAvatarService {
  constructor(private userDao: UserDao, private configService: ConfigService<ConfigurationPath>) {}

  async updateAvatar(user: User, file: Express.Multer.File) {
    await fs.writeFile(this.getAccountAvatarFilePath(user), file.buffer);
    const avatar = new Avatar(user.guid);
    await this.userDao.updateOneSetById(user, { avatar: new Avatar(user.guid) });
    return avatar;
  }

  private getAccountAvatarFilePath(user: User) {
    return getLocalFilePath(this.configService, 'avatars', user.guid);
  }

  async updateGravatar(user: User) {
    const hash = crypto.createHash('md5').update(user.email).digest('hex');
    const gravatarUrl = `https://s.gravatar.com/avatar/${hash}?s=64`;
    client.get(gravatarUrl, (res) => res.pipe(createWriteStream(this.getAccountAvatarFilePath(user))));
    const avatar = new Avatar(user.guid);
    await this.userDao.updateOneSetById(user, { avatar: new Avatar(user.guid) });
    return avatar;
  }
}
