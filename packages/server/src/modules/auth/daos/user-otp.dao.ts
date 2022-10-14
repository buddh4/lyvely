import { AbstractDao } from '@/modules/core';
import { UserOtp, UserOtpDocument } from '@/modules/auth/schemas/user-otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserOtpDao extends AbstractDao<UserOtp> {
  constructor(@InjectModel(UserOtp.name) protected model: Model<UserOtpDocument>) {
    super();
  }

  getModelConstructor() {
    return UserOtp;
  }

  getModuleId(): string {
    return 'auth';
  }
}
