import { AbstractDao, DocumentIdentity, Model } from '@/core';
import { UserOtp } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';

export class UserOtpDao extends AbstractDao<UserOtp> {
  constructor(@InjectModel(UserOtp.name) protected model: Model<UserOtp>) {
    super();
  }

  incrementAttempt(identity: DocumentIdentity<UserOtp>) {
    return this.updateOneById(identity, { $inc: { attempts: 1 } });
  }

  getModelConstructor() {
    return UserOtp;
  }

  getModuleId(): string {
    return 'auth';
  }
}
