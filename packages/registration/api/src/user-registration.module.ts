import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@lyvely/profiles';
import { UsersModule } from '@lyvely/users';
import { UserRegistrationService } from './services/user-registration.service';
import { AuthModule } from '@lyvely/auth';
import { UserOtpModule } from '@lyvely/otp';
import { InvitationsModule } from '@lyvely/invitations';
import { SystemMessagesModule } from '@lyvely/system-messages';

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
