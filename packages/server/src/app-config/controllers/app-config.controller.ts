import { ClassSerializerInterceptor, Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { ConfigurationPath, LyvelyRequest, Public } from '@/core';
import { AppConfigEndpoint, ENDPOINT_APP_CONFIG } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { I18n } from '@/i18n';
import { LegalService } from '@/legal/services/legal.service';

@Controller(ENDPOINT_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  constructor(
    private readonly configService: ConfigService<ConfigurationPath & any>,
    private readonly legalService: LegalService,
    private readonly i18n: I18n,
  ) {}

  @Public()
  @Get()
  async getConfig(@Req() req: LyvelyRequest) {
    return {
      appName: this.configService.get('appName', 'lyvely'),
      docUrl: this.configService.get('docUrl'),
      csrf_token: req.csrfToken(),
      legal: await this.legalService.getSections(),
      locales: this.i18n.getEnabledLocaleDefinitions(),
      registrationMode: this.configService.get('userRegistration.mode', 'public'),
    };
  }
}
