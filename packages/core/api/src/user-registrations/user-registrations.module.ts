import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers';
import { ProfilesModule } from '@/profiles';
import { UsersModule } from '@/users';
import { UserRegistrationService } from './services';
import { AuthModule } from '@/auth';
import { OtpModule } from '@/otp';
import { UserInvitationsModule } from '@/user-invitations';
import { SystemMessagesModule } from '@/system-messages';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfilesModule,
    OtpModule,
    UserInvitationsModule,
    SystemMessagesModule,
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationsModule {}
