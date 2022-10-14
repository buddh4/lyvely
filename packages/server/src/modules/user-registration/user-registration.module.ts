import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@/modules/profiles';
import { UsersModule } from '@/modules/users';
import { UserRegistrationService } from './services/user-registration.service';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, ProfilesModule],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
