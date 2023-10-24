import { StrictEndpoint } from '@lyvely/common';
import { UserRegistration } from '../models';
import { ResendOtp, OtpInfo } from '@/otp';
import { VerifyEmailDto } from '@/user-accounts';
import { ILoginResponse } from '@/auth';

export interface IUserRegistrationService {
  /**
   * @throws FieldValidationException
   * @param model
   */
  register(model: UserRegistration): Promise<OtpInfo>;
  verifyEmail(otp: VerifyEmailDto): Promise<ILoginResponse>;
  resendVerifyEmail(model: ResendOtp): Promise<OtpInfo>;
}

export type UserRegistrationEndpoint = StrictEndpoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
