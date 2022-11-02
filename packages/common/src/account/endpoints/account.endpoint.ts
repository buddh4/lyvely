import { StrictEndpoint } from '@/endpoints';
import { AddEmailDto, VerifyEmailDto } from '@/account/dtos';
import { ResendOtpDto } from '@/user-registration';
import { OtpInfo } from '@/auth';
import { AvatarModel } from '@/users';

export interface IAccountService {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  verifyEmail(dto: VerifyEmailDto);
  resendOtp(dto: ResendOtpDto): Promise<OtpInfo>;
  updateAvatar(file: any): Promise<AvatarModel>;
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
