import { IUserRegistrationClient } from './user-registration.endpoint';
import { UserRegistration } from '../models';
import registerRepository from './user-registration.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/endpoints';
import { useSingleton } from '@lyvely/common';
import { OtpInfo, ResendOtp } from '@/otp';
import { VerifyEmailDto } from '@/user-account';
import { StringFieldValidityRequest } from '@/validation';

export class UserRegistrationClient implements IUserRegistrationClient {
  async register(model: UserRegistration): Promise<OtpInfo> {
    return unwrapAndTransformResponse(registerRepository.register(model), OtpInfo);
  }

  async verifyEmail(verifyEmail: VerifyEmailDto) {
    return unwrapResponse(registerRepository.verifyEmail(verifyEmail));
  }

  async resendVerifyEmail(dto: ResendOtp): Promise<OtpInfo> {
    return unwrapAndTransformResponse(registerRepository.resendVerifyEmail(dto), OtpInfo);
  }

  async checkUserEmail(model: StringFieldValidityRequest): Promise<void> {
    return unwrapResponse(registerRepository.checkUserEmail(model));
  }

  async checkUsername(model: StringFieldValidityRequest): Promise<void> {
    return unwrapResponse(registerRepository.checkUsername(model));
  }
}

export const useUserRegistrationClient = useSingleton(() => new UserRegistrationClient());
