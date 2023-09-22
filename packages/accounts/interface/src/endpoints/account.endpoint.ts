import { StrictEndpoint } from '@lyvely/common';
import { AddEmailDto, VerifyEmailDto } from '../dtos';
import { ResendOtp, OtpInfo } from '@lyvely/otp-interface';
import { AvatarModel } from '@lyvely/users';

export interface IAccountService {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  verifyEmail(dto: VerifyEmailDto);
  resendOtp(dto: ResendOtp): Promise<OtpInfo | null>;
  updateAvatar(file: any): Promise<AvatarModel>;
  updateGravatar(): Promise<AvatarModel>;
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
