import { ClassSerializerInterceptor, Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { Public } from '@/modules/core';
import { UserRequest } from '@/modules/users';
import { AppConfigEndpoint, ENDPOINT_APP_CONFIG } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from '@/modules/i18n/services/i18n.service';

@Controller(ENDPOINT_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  constructor(private readonly configService: ConfigService, private readonly i18nService: I18nService) {}

  @Public()
  @Get()
  async getConfig(@Req() req: UserRequest) {
    return {
      csrf_token: req.csrfToken(),
      locales: this.i18nService.getEnabledLocaleDefinitions(),
    };
  }
}
