import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { UsersModule } from '@/users';
import { AccountService } from '@/account/services/account.service';
import { UserOtpModule } from '@/user-otp';
import { AccountAvatarService } from '@/account/services/account-avatar.service';

@Module({
  providers: [AccountService, AccountAvatarService],
  controllers: [AccountController],
  imports: [UsersModule, UserOtpModule],
})
export class AccountModule {}
