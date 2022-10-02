import { Module } from '@nestjs/common';
import { UserRegistrationController } from './user-registration.controller';
import { ProfilesModule } from '../profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UsersModule } from '../users';
import { UserRegistrationService } from './user-registration.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UsersModule, ProfilesModule],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
