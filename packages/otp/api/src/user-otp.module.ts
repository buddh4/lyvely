import { Module } from '@nestjs/common';
import { UserOtpService } from './services';
import { UserOtp, UserOtpSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserOtpDao } from './daos';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserOtp.name, schema: UserOtpSchema }])],
  providers: [UserOtpService, UserOtpDao],
  exports: [UserOtpService],
})
export class UserOtpModule {}
