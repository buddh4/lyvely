import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@/modules/users';
import { UserOtp } from '../schemas/user-otp.schema';
import { UserStatus } from '@lyvely/common';
import { UserOtpDao } from '@/modules/auth/daos/user-otp.dao';
import { generateOTP } from '@/modules/auth/utils/otp.generator';
import ms from 'ms';
import bcrypt from 'bcrypt';
import { EntityIdentity } from '@/modules/core';

interface GenerateOtpOptions {
  purpose: string;
  remember?: boolean;
  length?: number;
  expiresIn?: string | number;
}

export const DEFAULT_MAX_OTP_ATTEMPTS = 4;

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
      throw new UnauthorizedException();
    }

    return this.userOtpDao.findOne({ uid: user._id, purpose });
  }

  async runValidation(user: User, purpose: string, otp: string, max = DEFAULT_MAX_OTP_ATTEMPTS) {
    const otpModel = await this.findOtpByUserAndPurpose(user, purpose);

    if (!otpModel) throw new UnauthorizedException();

    const isExpired = otpModel.isExpired();
    const isValid = !isExpired && (await this.validateOtp(user, purpose, otp, otpModel));
    const maxAttempts = otpModel.attempts + 1 >= max;

    if (isValid || isExpired || maxAttempts) {
      await this.invalidateOtpByUserAndPurpose(user, purpose);
    } else {
      await this.incrementAttempt(otpModel);
    }

    return {
      isValid,
      remember: otpModel.remember,
      attempts: isExpired || isValid || maxAttempts ? 0 : Math.max(0, max - otpModel.attempts),
    };
  }

  async validateOtp(user: User, purpose: string, otp: string, otpModel: UserOtp, max = DEFAULT_MAX_OTP_ATTEMPTS) {
    return (
      otpModel &&
      otpModel.uid.equals(user._id) &&
      otpModel.attempts < max &&
      otpModel.purpose === purpose &&
      !otpModel.isExpired() &&
      (await bcrypt.compare(otp, otpModel.otp))
    );
  }

  async incrementAttempt(identity: EntityIdentity<UserOtp>) {
    return this.userOtpDao.incrementAttempt(identity);
  }

  async invalidateOtpByUserAndPurpose(user: User, purpose: string) {
    return this.userOtpDao.deleteMany({ uid: user._id, purpose });
  }
}
