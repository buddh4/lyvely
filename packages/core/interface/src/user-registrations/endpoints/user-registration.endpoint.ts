import { StrictEndpoint } from '@lyvely/common';
import { UserRegistration } from '../models';
import { ResendOtp, OtpInfo } from '@/otp';
import { VerifyEmailDto } from '@/user-accounts';
import { ILoginResponse } from '@/auth';
import { StringFieldValidityRequest } from '@/validation';

export interface IUserRegistrationService {
  /**
   * @throws FieldValidationException
   * @param model
   */
  register(model: UserRegistration): Promise<OtpInfo>;
  verifyEmail(otp: VerifyEmailDto): Promise<ILoginResponse>;
  resendVerifyEmail(model: ResendOtp): Promise<OtpInfo>;
  checkUserEmailValidity(model: StringFieldValidityRequest): Promise<void>;
  checkUserNameValidity(model: StringFieldValidityRequest): Promise<void>;
}

export type UserRegistrationEndpoint = StrictEndpoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
export const ENDPOINT_USER_REGISTRATION_VALIDATE_USERNAME = 'check-user-name';
