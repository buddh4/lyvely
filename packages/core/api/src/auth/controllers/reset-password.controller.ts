import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import {
  ENDPOINT_RESET_PASSWORD,
  ResetPasswordEndpoint,
  SendResetPasswordMail,
  ResetPassword,
  ResetPasswordEndpointPaths,
} from '@lyvely/interface';
import { Public, UseClassSerializer } from '@/core';
import { ResetPasswordService } from '../services';
import { JwtResetPasswordGuard, LoginThrottlerGuard } from '../guards';
import { CaptchaGuard } from '@/captcha';
import { UserRequest, UserThrottle } from '@/users';

@Controller(ENDPOINT_RESET_PASSWORD)
@UseClassSerializer()
export class ResetPasswordController implements ResetPasswordEndpoint {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @Public()
  @Post()
  @UseGuards(JwtResetPasswordGuard)
  async resetPassword(@Body() model: ResetPassword, @Req() req: UserRequest) {
    await this.resetPasswordService.resetPassword(req.user, model.password);
  }

  @Public()
  @Post(ResetPasswordEndpointPaths.SEND_MAIL)
  @UseGuards(LoginThrottlerGuard, CaptchaGuard)
  @UserThrottle(2, 60)
  async sendMail(@Body() model: SendResetPasswordMail) {
    await this.resetPasswordService.sendMail(model.usernameOrEmail);
  }
}
