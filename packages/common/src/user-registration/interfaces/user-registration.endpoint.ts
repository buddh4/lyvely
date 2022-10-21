import { StrictEndpoint } from '@/endpoints';
import { UserRegistrationDto, ResendOtpDto } from '../dtos';
import { VerifyEmailDto } from '@/account/dtos';
import { ILoginResponse, OtpInfo } from '@/auth';

export interface IUserRegistrationService {
  /**
   * @throws FieldValidationException
   * @param model
   */
  register(model: UserRegistrationDto): Promise<OtpInfo>;
  verifyEmail(otp: VerifyEmailDto): Promise<ILoginResponse>;
  resendVerifyEmail(model: ResendOtpDto): Promise<OtpInfo>;
}

export type UserRegistrationEndpoint = StrictEndpoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
