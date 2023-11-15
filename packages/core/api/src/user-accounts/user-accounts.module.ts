import { Module } from '@nestjs/common';
import { AccountController } from './controllers';
import { UsersModule } from '@/users';
import { AccountService, AccountAvatarService } from './services';
import { OtpModule } from '@/otp';
import { UserAccountEvents } from './user-account.events';

@Module({
  providers: [AccountService, AccountAvatarService, UserAccountEvents],
  controllers: [AccountController],
  imports: [UsersModule, OtpModule],
})
export class UserAccountsModule {}
