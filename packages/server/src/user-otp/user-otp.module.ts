import { Module } from '@nestjs/common';
import { UserOtpService } from '@/user-otp/services/user-otp.service';
import { UserOtp, UserOtpSchema } from '@/user-otp/schemas/user-otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserOtpDao } from '@/user-otp/daos';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserOtp.name, schema: UserOtpSchema }])],
  providers: [UserOtpService, UserOtpDao],
  exports: [UserOtpService],
})
export class UserOtpModule {}
