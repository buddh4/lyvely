import { ClassSerializerInterceptor, Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { LyvelyRequest, Public } from '@/core';
import { AppConfigEndpoint, ENDPOINT_APP_CONFIG, IAppConfig } from '@lyvely/interface';
import { AppConfigService } from '../services';

@Controller(ENDPOINT_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  constructor(private readonly appConfigService: AppConfigService) {}

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
