import { UserRegistrationController } from './controllers';
import { ProfilesModule } from '@/profiles';
import { UsersModule } from '@/users';
import { UserRegistrationService } from './services';
import { AuthModule } from '@/auth';
import { OtpModule } from '@/otp';
import { UserInvitationsModule } from '@/user-invitations';
import { SystemMessagesModule } from '@/system-messages';
import { LyvelyModule } from '@/core';
import { USER_REGISTRATION_MODULE_ID } from '@lyvely/core-interface';
import { UserRegistrationEvents } from './user-registration.events';

@LyvelyModule({
  id: USER_REGISTRATION_MODULE_ID,
  name: 'User Registration',
  path: __dirname,
  imports: [
    UsersModule,
    AuthModule,
    ProfilesModule,
    OtpModule,
    UserInvitationsModule,
    SystemMessagesModule,
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService, UserRegistrationEvents],
})
export class UserRegistrationsModule {}
