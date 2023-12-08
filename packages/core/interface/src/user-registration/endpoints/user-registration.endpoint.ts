import { StrictEndpoint } from '@/endpoints';
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
export const API_USER_REGISTRATION = 'user-registration';
export const API_USER_REGISTRATION_VALIDATE_USERNAME = 'check-user-name';

export const UserRegistrationEndpoints = {
  VERIFY_EMAIL: 'verify-email',
  RESENT_VERIFY_EMAIL: 'resend-verify-email',
  CHECK_USER_EMAIL: 'check-user-email',
  CHECK_USERNAME: 'check-username',
};
