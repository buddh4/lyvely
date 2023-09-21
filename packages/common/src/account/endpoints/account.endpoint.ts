import { StrictEndpoint } from '@lyvely/core';
import { AddEmailDto, VerifyEmailDto } from '@lyvely/account';
import { ResendOtp } from '@lyvely/user-registration';
import { OtpInfo } from '@lyvely/auth';
import { AvatarModel } from '@lyvely/users';

export interface IAccountService {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  verifyEmail(dto: VerifyEmailDto);
  resendOtp(dto: ResendOtp): Promise<OtpInfo>;
  updateAvatar(file: any): Promise<AvatarModel>;
  updateGravatar(): Promise<AvatarModel>;
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
