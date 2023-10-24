import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@/users';
import { UserStatus } from '@lyvely/core-interface';
import { DEFAULT_MAX_OTP_ATTEMPTS } from '@lyvely/core-interface';
import { UserOtp } from '../schemas';
import { UserOtpDao } from '../daos';
import { generateOTP } from '../utils';
import ms from 'ms';
import * as bcrypt from 'bcrypt';
import { EntityIdentity } from '@/core';
import { IntegrityException } from '@lyvely/common';

export interface IGenerateOtpOptions<TContext = any> {
  purpose: string;
  context?: TContext;
  remember?: boolean;
  length?: number;
  expiresIn?: string;
}

interface IOtpValidationOptions<TContext = any> {
  max?: number;
  contextValidator?: (context?: TContext) => boolean | Promise<boolean>;
}

const DEFAULT_OTP_EXPIRATION = '2m';

@Injectable()
export class OtpService<TContext = any> {
  constructor(private readonly userOtpDao: UserOtpDao) {}

  async createOrUpdateUserOtp(
    user: User,
    options: IGenerateOtpOptions<TContext>,
  ): Promise<{ otpModel: UserOtp<TContext>; otp: string }> {
    if (user.status === UserStatus.Disabled) throw new UnauthorizedException();

    const { otp, hashedOtp } = await this.generateOtp(options);

    const otpModel = await this.userOtpDao.upsert(
      { uid: user._id, purpose: options.purpose },
      new UserOtp<TContext>({
        uid: user._id,
        otp: hashedOtp,
        remember: options.remember,
        purpose: options.purpose,
        context: options.context as any,
        issuedAt: new Date(),
        expiresIn: ms(options.expiresIn || DEFAULT_OTP_EXPIRATION),
      }),
    );

    if (!otpModel) throw new IntegrityException('Could not upsert otp model');

    return { otpModel, otp };
  }

  protected async generateOtp(options: IGenerateOtpOptions) {
    const length = options.length || 6;
    const otp = generateOTP(length);
    const hashedOtp = await bcrypt.hash(otp, 10);
    return { otp, hashedOtp };
  }

  async findOtpByUserAndPurpose(user: User, purpose: string): Promise<UserOtp<TContext> | null> {
    if (user.status === UserStatus.Disabled) {
      throw new UnauthorizedException();
    }

    return this.userOtpDao.findOne({ uid: user._id, purpose });
  }

  async runValidation(
    user: User,
    purpose: string,
    otp: string,
    options: IOtpValidationOptions<TContext> = {},
  ) {
    options.max = options.max || DEFAULT_MAX_OTP_ATTEMPTS;
    const otpModel = await this.findOtpByUserAndPurpose(user, purpose);

    if (!otpModel) throw new UnauthorizedException();

    const isExpired = otpModel.isExpired();
    const isValid = !isExpired && (await this.validateOtp(user, purpose, otp, otpModel, options));
    const maxAttempts = otpModel.attempts + 1 >= options.max;

    if (isValid || isExpired || maxAttempts) {
      await this.invalidateOtpByUserAndPurpose(user, purpose);
    } else {
      await this.incrementAttempt(otpModel);
    }

    return {
      isValid,
      remember: otpModel.remember,
      attempts:
        isExpired || isValid || maxAttempts ? 0 : Math.max(0, options.max - otpModel.attempts),
    };
  }

  async validateOtp(
    user: User,
    purpose: string,
    otp: string,
    otpModel: UserOtp<TContext>,
    options: IOtpValidationOptions<TContext> = {},
  ) {
    options.max = options.max || DEFAULT_MAX_OTP_ATTEMPTS;
    return (
      otpModel &&
      otpModel.uid.equals(user._id) &&
      otpModel.attempts < options.max &&
      otpModel.purpose === purpose &&
      !otpModel.isExpired() &&
      (await this.runContextValidation(otpModel, options)) &&
      (await bcrypt.compare(otp, otpModel.otp))
    );
  }

  private async runContextValidation(
    otpModel: UserOtp<TContext>,
    options: IOtpValidationOptions<TContext>,
  ): Promise<boolean> {
    return options.contextValidator ? options.contextValidator(otpModel.context) : true;
  }

  async incrementAttempt(identity: EntityIdentity<UserOtp<TContext>>) {
    return this.userOtpDao.incrementAttempt(identity);
  }

  async invalidateOtpByUserAndPurpose(user: User, purpose: string) {
    return this.userOtpDao.deleteMany({ uid: user._id, purpose });
  }
}
