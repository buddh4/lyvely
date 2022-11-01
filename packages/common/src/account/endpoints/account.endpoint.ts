import { StrictEndpoint } from '@/endpoints';
import { AddEmailDto, VerifyEmailDto } from '@/account/dtos';
import { ResendOtpDto } from '@/user-registration';
import { OtpInfo } from '@/auth';

export interface IAccountService {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  verifyEmail(dto: VerifyEmailDto);
  resendOtp(dto: ResendOtpDto): Promise<OtpInfo>;
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
