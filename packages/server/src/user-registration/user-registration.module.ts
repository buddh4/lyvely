import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@/profiles';
import { UsersModule } from '@/users';
import { UserRegistrationService } from './services/user-registration.service';
import { AuthModule } from '@/auth/auth.module';
import { UserOtpModule } from '@/user-otp';
import { InvitationsModule } from '@/invitations/invitations.module';
import { SystemMessagesModule } from '@/system-messages/system-messages.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfilesModule,
    UserOtpModule,
    InvitationsModule,
    SystemMessagesModule,
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
