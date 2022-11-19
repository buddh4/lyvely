import { IUserRegistrationService, UserRegistrationDto, VerifyEmailDto, ResendOtpDto, OtpInfo } from '@lyvely/common';
import registerRepository from '../repositories/user-registration.repository';
import { unwrapResponse } from '@/modules/core';

export class UserRegistrationService implements IUserRegistrationService {
  async register(model: UserRegistrationDto): Promise<OtpInfo> {
    return unwrapResponse(registerRepository.register(model)).then((otpInfo) => new OtpInfo(otpInfo));
  }

  async verifyEmail(verifyEmail: VerifyEmailDto) {
    return unwrapResponse(registerRepository.verifyEmail(verifyEmail));
  }

  async resendVerifyEmail(dto: ResendOtpDto): Promise<OtpInfo> {
    return unwrapResponse(registerRepository.resendVerifyEmail(dto)).then((otpInfo) => new OtpInfo(otpInfo));
  }
}
