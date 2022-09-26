import { Module } from '@nestjs/common';
import { UserInvitesController } from "./user-invites.controller";
import { ProfilesModule } from '../profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema , UsersModule} from '../users';
import { UserInvitesService } from "./user-invites.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    ProfilesModule
  ],
  controllers: [UserInvitesController],
  providers: [UserInvitesService]
})
export class UserInvitesModule {}
