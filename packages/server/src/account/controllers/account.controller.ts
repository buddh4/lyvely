import { Body, Controller, Post, Req } from '@nestjs/common';
import { AccountEndpoint, AddEmailDto, ENDPOINT_ACCOUNT, VerifyEmailDto, ResendOtpDto } from '@lyvely/common';
import { UseClassSerializer } from '@/core';
import { UserRequest } from '@/users';
import { AccountService } from '@/account/services/account.service';

@Controller(ENDPOINT_ACCOUNT)
@UseClassSerializer()
export class AccountController implements AccountEndpoint {
  constructor(private accountService: AccountService) {}

  @Post('add-email')
  async addEmail(@Body() dto: AddEmailDto, @Req() req: UserRequest) {
    return this.accountService.addEmail(req.user, dto.email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: UserRequest) {
    await this.accountService.verifyEmail(req.user, dto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto, @Req() req: UserRequest) {
    return this.accountService.resendOtp(req.user, dto.email);
  }
}
