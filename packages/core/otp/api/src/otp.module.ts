import { Module } from '@nestjs/common';
import { OtpService } from './services';
import { UserOtp, UserOtpSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserOtpDao } from './daos';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserOtp.name, schema: UserOtpSchema }])],
  providers: [OtpService, UserOtpDao],
  exports: [OtpService],
})
export class OtpModule {}
