import { Module } from '@nestjs/common';
import { AccountController } from './controllers';
import { UsersModule } from '@lyvely/users';
import { AccountService, AccountAvatarService } from './services';
import { OtpModule } from '@lyvely/otp';

@Module({
  providers: [AccountService, AccountAvatarService],
  controllers: [AccountController],
  imports: [UsersModule, OtpModule],
})
export class AccountModule {}
