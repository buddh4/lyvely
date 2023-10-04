import { StrictEndpoint } from '@lyvely/common';
import { UserRegistration } from '../models';
import { ResendOtp, OtpInfo } from '@lyvely/otp-interface';
import { VerifyEmailDto } from '@lyvely/user-accounts-interface';
import { ILoginResponse } from '@lyvely/auth-interface';

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
