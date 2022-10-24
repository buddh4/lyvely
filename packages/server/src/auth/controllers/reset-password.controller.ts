import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ENDPOINT_RESET_PASSWORD, ResetPasswordEndpoint, SendResetPasswordMailModel } from '@lyvely/common';
import { Public, UseClassSerializer } from '@/core';
import { ResetPasswordService } from '@/auth/services/reset-password.service';
import { CaptchaGuard } from '@/captcha';

@Controller(ENDPOINT_RESET_PASSWORD)
@UseClassSerializer()
export class ResetPasswordController implements ResetPasswordEndpoint {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @Public()
  @UseGuards(CaptchaGuard)
  @Post('send-mail')
  async sendMail(@Body() model: SendResetPasswordMailModel) {
    await this.resetPasswordService.sendMail(model.email);
  }
}
