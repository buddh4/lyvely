import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/users.schema';
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
