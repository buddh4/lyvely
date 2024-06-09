import { Module } from '@nestjs/common';
import { UsersService, UserSettingsRegistry, UserSettingsService } from './services';
import { User, UserSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDao } from './daos';
import { BaseUserGuard } from '@/users/guards';

const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);

@Module({
  imports: [UserModel],
  providers: [UsersService, UserDao, UserSettingsService, UserSettingsRegistry, BaseUserGuard],
  exports: [UsersService, UserModel, UserDao, UserSettingsService, UserSettingsRegistry],
})
export class UsersModule {}
