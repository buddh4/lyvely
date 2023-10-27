import {
  IUserRegistrationService,
  UserRegistration,
  VerifyEmailDto,
  ResendOtp,
  OtpInfo,
  StringFieldValidityRequest,
} from '@lyvely/core-interface';
import registerRepository from '../repositories/user-registration.repository';
import { unwrapResponse } from '@/core';
import { useSingleton } from '@lyvely/common';

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

  async checkUserEmailValidity(model: StringFieldValidityRequest): Promise<void> {
    return unwrapResponse(registerRepository.checkUserEmailValidity(model));
  }

  async checkUserNameValidity(model: StringFieldValidityRequest): Promise<void> {
    return unwrapResponse(registerRepository.checkUserNameValidity(model));
  }
}

export const useUserRegistrationService = useSingleton(() => new UserRegistrationService());
