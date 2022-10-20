import { StrictEndpoint } from '@/endpoints';
import { UserRegistrationDto, ResendOtpDto } from '../dtos';
import { VerifyEmailDto } from '@/account/dtos';
import { ILoginResponse } from '@/auth';

export interface IUserRegistrationService {
  /**
   * @throws FieldValidationException
   * @param model
   */
  register(model: UserRegistrationDto): Promise<void>;
  verifyEmail(otp: VerifyEmailDto): Promise<ILoginResponse>;
  resendVerifyEmail(model: ResendOtpDto): Promise<void>;
}

export type UserRegistrationEndpoint = StrictEndpoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
