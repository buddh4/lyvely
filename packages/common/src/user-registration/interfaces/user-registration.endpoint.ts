import { StrictEndpoint } from '@/endpoints';
import { UserRegistration, ResendOtp } from '../models';
import { VerifyEmailDto } from '@/account/dtos';
import { ILoginResponse, OtpInfo } from '@/auth';

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
