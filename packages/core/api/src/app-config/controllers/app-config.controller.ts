import { ClassSerializerInterceptor, Get, Req, UseInterceptors } from '@nestjs/common';
import { Controller, LyvelyRequest, Public } from '@/core';
import { AppConfigEndpoint, API_APP_CONFIG, IAppConfig } from '@lyvely/interface';
import { AppConfigService } from '../services';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/config';

@Controller(API_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly configService: ConfigService<ConfigurationPath>,
  ) {}

  @Public()
  @Get()
  async getConfig(@Req() req: LyvelyRequest): Promise<IAppConfig> {
    const config = this.appConfigService.getAppConfig();
    if (req.csrfToken) {
      config.csrf_token = req.csrfToken();
    }
    return config;
  }
}
