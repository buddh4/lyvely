import { Post, UseGuards, Req } from '@nestjs/common';
import {
  API_RESET_PASSWORD,
  ResetPasswordEndpoint,
  SendResetPasswordMail,
  ResetPassword,
  ResetPasswordEndpoints,
} from '@lyvely/interface';
import { Public, ValidBody } from '@/core';
import { ResetPasswordService } from '../services';
import { JwtResetPasswordGuard, LoginThrottlerGuard } from '../guards';
import { CaptchaGuard } from '@/captcha';
import { UserRequest, UserThrottle } from '@/users';
import { GlobalController } from '@/common';

@GlobalController(API_RESET_PASSWORD)
export class ResetPasswordController implements ResetPasswordEndpoint {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @Public()
  @Post()
  @UseGuards(JwtResetPasswordGuard)
  async resetPassword(@ValidBody() model: ResetPassword, @Req() req: UserRequest) {
    await this.resetPasswordService.resetPassword(req.user, model.password);
  }

  @Public()
  @Post(ResetPasswordEndpoints.SEND_MAIL)
  @UseGuards(LoginThrottlerGuard, CaptchaGuard)
  @UserThrottle(2, 60_000)
  async sendMail(@ValidBody() model: SendResetPasswordMail) {
    await this.resetPasswordService.sendMail(model.usernameOrEmail);
  }
}
