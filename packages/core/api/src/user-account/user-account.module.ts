import { Module } from '@nestjs/common';
import { UserAccountController } from './controllers';
import { UsersModule } from '@/users';
import { UserAccountService, AccountAvatarService } from './services';
import { OtpModule } from '@/otp';
import { UserAccountEvents } from './user-account.events';
import { AvatarsModule } from '../avatars';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigFactory } from '@/files';

@Module({
  providers: [UserAccountService, AccountAvatarService, UserAccountEvents],
  controllers: [UserAccountController],
  imports: [
    UsersModule,
    OtpModule,
    AvatarsModule,
    MulterModule.registerAsync({
      useClass: MulterConfigFactory,
    }),
  ],
})
export class UserAccountModule {}
