import { Controller, Get, Query, Post, HttpCode, Body, StreamableFile } from '@nestjs/common';
import { CaptchaService } from '@/captcha/services/captcha.service';
import { Readable } from 'stream';
import { Public } from '@/core';
import { ENDPOINT_CAPTCHA, CaptchaChallenge, CaptchaEndpoint } from '@lyvely/common';

@Controller(ENDPOINT_CAPTCHA)
export class CaptchaController implements CaptchaEndpoint {
  constructor(private captchaService: CaptchaService) {}

  @Public()
  @Post()
  async challenge(): Promise<CaptchaChallenge> {
    return this.captchaService.createCaptcha();
  }

  @Public()
  @Post('refresh')
  @HttpCode(204)
  async refresh(@Body('identity') identity: string) {
    console.log(identity);
    return this.captchaService.refresh(identity);
  }

  @Public()
  @Get()
  async render(@Query('identity') identity: string): Promise<StreamableFile> {
    const imageBuffer = await this.captchaService.render(identity);
    return new StreamableFile(Readable.from(imageBuffer));
  }
}
