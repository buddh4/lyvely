import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@/profiles';
import { UsersModule } from '@/users';
import { UserRegistrationService } from './services/user-registration.service';
import { AuthModule } from '@/auth/auth.module';
import { UserOtpModule } from '@/user-otp';
import { NotificationsModule } from '@/notifications/notifications.module';
import { WelcomeNotification } from '@/user-registration/notifications/welcome.notification';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfilesModule,
    UserOtpModule,
    // NotificationsModule.registerNotifications(WelcomeNotification),
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
