import { Get, Res, Param, NotFoundException, Header, Logger } from '@nestjs/common';
import { Public, UseClassSerializer } from '@/core';
import { isGuid } from '@lyvely/common';
import { getLocalUploadFilePath } from '@/files';
import fs from 'fs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Controller } from '@/common';

@Controller('avatars')
@UseClassSerializer()
export class AvatarsController {
  private logger = new Logger(AvatarsController.name);

  constructor(private readonly configService: ConfigService) {}

  @Get(':guid')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  @Public()
  public async loadAvatar(@Param('guid') guid, @Res() res: Response) {
    if (!isGuid(guid)) throw new NotFoundException();

    const path = getLocalUploadFilePath(this.configService, 'avatars', guid);

    if (!fs.existsSync(path)) throw new NotFoundException();

    const file = fs.createReadStream(path);
    res.set({ 'Content-Type': 'image/jpeg' });
    file.pipe(res);
  }
}
