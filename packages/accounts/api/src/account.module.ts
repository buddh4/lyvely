import { Module } from '@nestjs/common';
import { AccountController } from './controllers';
import { UsersModule } from '@lyvely/users';
import { AccountService, AccountAvatarService } from './services';
import { UserOtpModule } from '@lyvely/otp';

@Module({
  providers: [AccountService, AccountAvatarService],
  controllers: [AccountController],
  imports: [UsersModule, UserOtpModule],
})
export class AccountModule {}
