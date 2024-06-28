import { ClassSerializerInterceptor, Get, Req, UseInterceptors } from '@nestjs/common';
import { Public } from '@/core';
import { GlobalController } from '@/common';
import { AppConfigEndpoint, API_APP_CONFIG, IAppConfig } from '@lyvely/interface';
import { AppConfigService } from '../services';
import type { OptionalUserRequest } from '@/users';

@GlobalController(API_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Public()
  @Get()
  async getConfig(@Req() req: OptionalUserRequest): Promise<IAppConfig> {
    const config = this.appConfigService.getAppConfig(req);
    if (req.csrfToken) {
      config.csrf_token = req.csrfToken();
    }
    return config;
  }
}
