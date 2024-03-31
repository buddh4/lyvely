import { Module } from '@nestjs/common';
import { UserAccountController } from './controllers';
import { UsersModule } from '@/users';
import { UserAccountService, AccountAvatarService } from './services';
import { OtpModule } from '@/otp';
import { UserAccountEvents } from './user-account.events';
import { AvatarsModule } from '../avatars';

@Module({
  providers: [UserAccountService, AccountAvatarService, UserAccountEvents],
  controllers: [UserAccountController],
  imports: [UsersModule, OtpModule, AvatarsModule],
})
export class UserAccountModule {}
