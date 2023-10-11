import { StrictEndpoint } from '@lyvely/common';
import { AvatarModel } from '@/avatars';
import { AddEmailDto, VerifyEmailDto } from '../dtos';
import { ResendOtp, OtpInfo } from '@/otp';

export interface IAccountService {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  verifyEmail(dto: VerifyEmailDto);
  resendOtp(dto: ResendOtp): Promise<OtpInfo | null>;
  updateAvatar(file: any): Promise<AvatarModel>;
  updateGravatar(): Promise<AvatarModel>;
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
