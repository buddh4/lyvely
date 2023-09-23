import {
  Controller,
  Get,
  Header,
  Query,
  Post,
  HttpCode,
  Body,
  StreamableFile,
} from '@nestjs/common';
import { CaptchaService } from '../services';
import { Readable } from 'stream';
import { Public } from '@lyvely/core';
import { ENDPOINT_CAPTCHA, CaptchaChallenge, CaptchaEndpoint } from '@lyvely/captchas-interface';

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
