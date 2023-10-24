import {
  IUserRegistrationService,
  UserRegistration,
  VerifyEmailDto,
  ResendOtp,
  OtpInfo,
} from '@lyvely/core-interface';
import registerRepository from '../repositories/user-registration.repository';
import { unwrapResponse } from '@/core';

export class UserRegistrationService implements IUserRegistrationService {
  async register(model: UserRegistration): Promise<OtpInfo> {
    return unwrapResponse(registerRepository.register(model)).then(
      (otpInfo) => new OtpInfo(otpInfo),
    );
  }

  async verifyEmail(verifyEmail: VerifyEmailDto) {
    return unwrapResponse(registerRepository.verifyEmail(verifyEmail));
  }

  async resendVerifyEmail(dto: ResendOtp): Promise<OtpInfo> {
    return unwrapResponse(registerRepository.resendVerifyEmail(dto)).then(
      (otpInfo) => new OtpInfo(otpInfo),
    );
  }
}
