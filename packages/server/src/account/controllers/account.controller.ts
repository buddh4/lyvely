import { Body, Controller, Post, Req } from '@nestjs/common';
import { AccountEndpoint, AddEmailDto, ENDPOINT_ACCOUNT, VerifyEmailDto } from '@lyvely/common';
import { UseClassSerializer } from '@/core';
import { UserRequest } from '@/users';
import { AccountService } from '@/account/services/account.service';

@Controller(ENDPOINT_ACCOUNT)
@UseClassSerializer()
export class AccountController implements AccountEndpoint {
  constructor(private accountService: AccountService) {}

  @Post('add-email')
  async addEmail(@Body() dto: AddEmailDto, @Req() req: UserRequest) {
    await this.accountService.addEmail(req.user, dto.email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: UserRequest) {
    await this.accountService.verifyEmail(req.user, dto);
  }
}