import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@/profiles';
import { UsersModule } from '@/users';
import { UserRegistrationService } from './services/user-registration.service';
import { AuthModule } from '@/auth/auth.module';
import { UserOtpModule } from '@/user-otp';

@Module({
  imports: [UsersModule, AuthModule, ProfilesModule, UserOtpModule],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
