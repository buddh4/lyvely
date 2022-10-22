import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { CaptchaService } from '@/captcha/services/captcha.service';
import { Readable } from 'stream';
import { Public } from '@/core';

@Controller('captcha')
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}

  @Public()
  @Get(':identity')
  async render(@Param('identity') identity: string): Promise<StreamableFile> {
    const imageBuffer = await this.captchaService.renderCaptchaImageByIdentity(identity);
    return new StreamableFile(Readable.from(imageBuffer));
  }
}
