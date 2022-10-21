import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { UsersModule } from '@/users';
import { AccountService } from '@/account/services/account.service';
import { UserOtpModule } from '@/user-otp';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [UsersModule, UserOtpModule],
})
export class AccountModule {}
