import { Get, Header, Query, Post, HttpCode, Body, StreamableFile } from '@nestjs/common';
import { CaptchaService } from '../services';
import { Readable } from 'stream';
import { Public } from '@/core';
import {
  API_CAPTCHA,
  CaptchaChallenge,
  CaptchaEndpoint,
  CaptchaEndpoints,
} from '@lyvely/interface';
import { Controller } from '@/common';

@Controller(API_CAPTCHA)
export class CaptchaController implements CaptchaEndpoint {
  constructor(private captchaService: CaptchaService) {}

  @Public()
  @Post()
  async challenge(): Promise<CaptchaChallenge> {
    return this.captchaService.createCaptcha();
  }

  @Public()
  @Post(CaptchaEndpoints.REFRESH)
  @HttpCode(204)
  async refresh(@Body('identity') identity: string) {
    return this.captchaService.refresh(identity);
  }

  @Public()
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  @Get()
  async render(@Query('identity') identity: string): Promise<StreamableFile> {
    const imageBuffer = await this.captchaService.render(identity);
    return new StreamableFile(Readable.from(imageBuffer));
  }
}
