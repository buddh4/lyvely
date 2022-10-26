import { ClassSerializerInterceptor, Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { ConfigurationPath, LyvelyRequest, Public } from '@/core';
import { AppConfigEndpoint, ENDPOINT_APP_CONFIG } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from '@/i18n/services/i18n.service';

@Controller(ENDPOINT_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  constructor(
    private readonly configService: ConfigService<ConfigurationPath>,
    private readonly i18nService: I18nService,
  ) {}

  @Public()
  @Get()
  async getConfig(@Req() req: LyvelyRequest) {
    return {
      appName: this.configService.get('appName'),
      docUrl: this.configService.get('docUrl'),
      csrf_token: req.csrfToken(),
      locales: this.i18nService.getEnabledLocaleDefinitions(),
    };
  }
}
