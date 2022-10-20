import { ClassSerializerInterceptor, Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { LyvelyRequest, Public } from '@/core';
import { AppConfigEndpoint, ENDPOINT_APP_CONFIG } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from '@/i18n/services/i18n.service';

@Controller(ENDPOINT_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  constructor(private readonly configService: ConfigService, private readonly i18nService: I18nService) {}

  @Public()
  @Get()
  async getConfig(@Req() req: LyvelyRequest) {
    return {
      csrf_token: req.csrfToken(),
      locales: this.i18nService.getEnabledLocaleDefinitions(),
    };
  }
}
