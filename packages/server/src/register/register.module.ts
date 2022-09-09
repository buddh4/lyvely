import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { ProfilesModule } from '../profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema , UsersModule} from '../users';
import { RegisterService } from './register.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    ProfilesModule
  ],
  controllers: [RegisterController],
  providers: [RegisterService]
})
export class RegisterModule {}
