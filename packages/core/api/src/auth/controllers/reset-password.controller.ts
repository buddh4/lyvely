import { Body, Post, UseGuards, Req } from '@nestjs/common';
import {
  API_RESET_PASSWORD,
  ResetPasswordEndpoint,
  SendResetPasswordMail,
  ResetPassword,
  ResetPasswordEndpoints,
} from '@lyvely/interface';
import { Public, UseClassSerializer } from '@/core';
import { ResetPasswordService } from '../services';
import { JwtResetPasswordGuard, LoginThrottlerGuard } from '../guards';
import { CaptchaGuard } from '@/captcha';
import { UserRequest, UserThrottle } from '@/users';
import { GlobalController } from '@/common';

@GlobalController(API_RESET_PASSWORD)
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
  @Post(ResetPasswordEndpoints.SEND_MAIL)
  @UseGuards(LoginThrottlerGuard, CaptchaGuard)
  @UserThrottle(2, 60_000)
  async sendMail(@Body() model: SendResetPasswordMail) {
    await this.resetPasswordService.sendMail(model.usernameOrEmail);
  }
}
