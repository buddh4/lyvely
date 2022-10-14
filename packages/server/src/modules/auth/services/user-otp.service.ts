import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@/modules/users';
import { UserOtp } from '../schemas/user-otp.schema';
import { UserStatus } from '@lyvely/common';
import { UserOtpDao } from '@/modules/auth/daos/user-otp.dao';
import { generateOTP } from '@/modules/auth/utils/otp.generator';
import ms from 'ms';
import bcrypt from 'bcrypt';

interface GenerateOtpOptions {
  purpose: string;
  remember?: boolean;
  length?: number;
  expiresIn?: string | number;
}

@Injectable()
export class UserOtpService {
  constructor(private readonly userOtpDao: UserOtpDao) {}

  async createOrUpdateUserOtp(user: User, options: GenerateOtpOptions) {
    if (user.status === UserStatus.Disabled) {
      throw new ForbiddenException('Otp creation is forbidden for disabled users.');
    }

    const { otp, hashedOtp } = await this.generateOtp(options);

    const model = await this.userOtpDao.upsert(
      { uid: user._id, purpose: options.purpose },
      new UserOtp({
        uid: user._id,
        otp: hashedOtp,
        remember: options.remember,
        purpose: options.purpose,
        issuedAt: new Date(),
        expiresIn: ms(options.expiresIn || '2m'),
      }),
    );

    return { model, otp };
  }

  private async generateOtp(options: GenerateOtpOptions) {
    const length = options.length || 6;
    const otp = generateOTP(length);
    const hashedOtp = await bcrypt.hash(otp, 10);
    return { otp, hashedOtp };
  }

  async findOtpByUserAndPurpose(user: User, purpose: string) {
    if (user.status === UserStatus.Disabled) {
      throw new ForbiddenException('Otp validation is forbidden for disabled users.');
    }

    return this.userOtpDao.findOne({ uid: user._id, purpose });
  }

  async validateOtp(user: User, purpose: string, otp: string, otpModel: UserOtp) {
    return (
      otpModel &&
      otpModel.uid.equals(user._id) &&
      otpModel.purpose === purpose &&
      !otpModel.isExpired() &&
      (await bcrypt.compare(otp, otpModel.otp))
    );
  }

  async invalidateOtpByUserAndPurpose(user: User, purpose: string) {
    return this.userOtpDao.deleteMany({ uid: user._id, purpose });
  }
}
