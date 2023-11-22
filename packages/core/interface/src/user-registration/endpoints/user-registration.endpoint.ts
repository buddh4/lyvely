import { StrictEndpoint } from '@lyvely/common';
import { UserRegistration } from '../models';
import { ResendOtp, OtpInfo } from '@/otp';
import { VerifyEmailDto } from '@/user-account';
import { ILoginResponse } from '@/auth';
import { StringFieldValidityRequest } from '@/validation';

export interface IUserRegistrationClient {
  /**
   * @throws FieldValidationException
   * @param model
   */
  register(model: UserRegistration): Promise<OtpInfo>;
  verifyEmail(otp: VerifyEmailDto): Promise<ILoginResponse>;
  resendVerifyEmail(model: ResendOtp): Promise<OtpInfo>;
  checkUserEmail(model: StringFieldValidityRequest): Promise<void>;
  checkUsername(model: StringFieldValidityRequest): Promise<void>;
}

export type UserRegistrationEndpoint = StrictEndpoint<IUserRegistrationClient>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
export const ENDPOINT_USER_REGISTRATION_VALIDATE_USERNAME = 'check-user-name';

export const UserRegistrationEndpointPaths = {
  VERIFY_EMAIL: 'verify-email',
  RESENT_VERIFY_EMAIL: 'resend-verify-email',
  CHECK_USER_EMAIL: 'check-user-email',
  CHECK_USERNAME: 'check-username',
};