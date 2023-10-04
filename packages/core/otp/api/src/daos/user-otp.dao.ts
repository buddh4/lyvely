import { AbstractDao, EntityIdentity } from '@lyvely/core';
import { UserOtp } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserOtpDao extends AbstractDao<UserOtp> {
  constructor(@InjectModel(UserOtp.name) protected model: Model<UserOtp>) {
    super();
  }

  incrementAttempt(identity: EntityIdentity<UserOtp>) {
    return this.updateOneById(identity, { $inc: { attempts: 1 } });
  }

  getModelConstructor() {
    return UserOtp;
  }

  getModuleId(): string {
    return 'auth';
  }
}
