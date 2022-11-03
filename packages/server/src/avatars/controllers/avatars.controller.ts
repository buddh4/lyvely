import { Get, Controller, Res, Param, NotFoundException } from '@nestjs/common';
import { Public, UseClassSerializer } from '@/core';
import { getLocalFilePath } from '@/files/file-path.utils';
import { join } from 'path';
import fs from 'fs';
import { Response } from 'express';
import { isGuid } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';

@Controller('avatars')
@UseClassSerializer()
export class AvatarsController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':guid')
  @Public()
  public async loadAvatar(@Param('guid') guid, @Res() res: Response) {
    if (!isGuid(guid)) throw new NotFoundException();

    const path = getLocalFilePath(this.configService, 'avatars', guid);
    if (!fs.existsSync(path)) throw new NotFoundException();
    const file = fs.createReadStream(path);

    res.set({ 'Content-Type': 'image/jpeg' });
    file.pipe(res);
  }
}
