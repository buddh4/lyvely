import { Module } from '@nestjs/common';
import { AccountController } from './controllers';
import { UsersModule } from '@/users';
import { AccountService, AccountAvatarService } from './services';
import { OtpModule } from '@/otp';

@Module({
  providers: [AccountService, AccountAvatarService],
  controllers: [AccountController],
  imports: [UsersModule, OtpModule],
})
export class UserAccountsModule {}
