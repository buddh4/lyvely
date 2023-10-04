import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@lyvely/profiles';
import { UsersModule } from '@lyvely/users';
import { UserRegistrationService } from './services/user-registration.service';
import { AuthModule } from '@lyvely/auth';
import { OtpModule } from '@lyvely/otp';
import { InvitationsModule } from '@lyvely/user-invitations';
import { SystemMessagesModule } from '@lyvely/system-messages';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfilesModule,
    OtpModule,
    InvitationsModule,
    SystemMessagesModule,
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
