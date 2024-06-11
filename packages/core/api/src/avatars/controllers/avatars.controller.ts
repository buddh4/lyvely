import { Get, Res, Param, NotFoundException, Header, Logger } from '@nestjs/common';
import { Public, UseClassSerializer } from '@/core';
import { StorageService } from '@/files';
import { Response } from 'express';
import { GlobalController } from '@/common';
import { STORAGE_BUCKET_AVATARS } from '../avatar.constants';

@GlobalController('avatars')
export class AvatarsController {
  private logger = new Logger(AvatarsController.name);

  constructor(private storageService: StorageService) {}

  @Public()
  @Get(':guid')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  public async loadAvatar(@Param('guid') guid, @Res() res: Response) {
    const fileStream = await this.storageService.download({
      guid,
      bucket: STORAGE_BUCKET_AVATARS,
    });

    if (!fileStream) throw new NotFoundException();

    res.set({ 'Content-Type': 'image/jpeg' });
    fileStream.pipe(res);
  }
}
