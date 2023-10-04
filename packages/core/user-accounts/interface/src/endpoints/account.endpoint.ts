import { StrictEndpoint } from '@lyvely/common';
import { AvatarModel } from '@lyvely/avatars-interface';
import { AddEmailDto, VerifyEmailDto } from '../dtos';
import { ResendOtp, OtpInfo } from '@lyvely/otp-interface';

export interface IAccountService {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  verifyEmail(dto: VerifyEmailDto);
  resendOtp(dto: ResendOtp): Promise<OtpInfo | null>;
  updateAvatar(file: any): Promise<AvatarModel>;
  updateGravatar(): Promise<AvatarModel>;
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
