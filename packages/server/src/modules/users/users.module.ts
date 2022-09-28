import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDao } from './daos/user.dao';

const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);

@Module({
  imports: [UserModel],
  providers: [UsersService, UserDao],
  exports: [UsersService, UserModel, UserDao],
})
export class UsersModule {}
