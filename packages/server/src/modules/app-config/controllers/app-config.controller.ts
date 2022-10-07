import { ClassSerializerInterceptor, Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { Public } from '@/modules/core';
import { UserRequest } from '@/modules/users';
import { AppConfigEndpoint, ENDPOINT_APP_CONFIG } from '@lyvely/common';

@Controller(ENDPOINT_APP_CONFIG)
@UseInterceptors(ClassSerializerInterceptor)
export class AppConfigController implements AppConfigEndpoint {
  @Public()
  @Get()
  async getConfig(@Req() req: UserRequest) {
    return {
      csrf_token: req.csrfToken(),
    };
  }
}
