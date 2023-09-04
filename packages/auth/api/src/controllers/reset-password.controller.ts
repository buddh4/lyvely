import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import {
  ENDPOINT_RESET_PASSWORD,
  ResetPasswordEndpoint,
  SendResetPasswordMail,
  ResetPassword,
} from '@lyvely/common';
import { Public, UseClassSerializer } from '@lyvely/core';
import { ResetPasswordService, JwtResetPasswordGuard, EmailBodyThrottlerGuard } from '@lyvely/auth';
import { CaptchaGuard } from '@lyvely/captchas';
import { UserRequest, UserThrottle } from '@lyvely/users';

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
  @Post('send-mail')
  @UseGuards(EmailBodyThrottlerGuard, CaptchaGuard)
  @UserThrottle(2, 60)
  async sendMail(@Body() model: SendResetPasswordMail) {
    await this.resetPasswordService.sendMail(model.email);
  }
}
