import { StrictEndpoint } from '@lyvely/common';
import { AvatarModel } from '@/avatars';
import { AddEmailDto, VerifyEmailDto } from '../dtos';
import { CalendarPreferences, SetLanguageDto, SetTimezoneDto } from '@/common';
import { ResendOtp, OtpInfo } from '@/otp';
import { SettingsUpdateResponse } from '@/settings';

export interface IAccountService {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  setLanguage(dto: SetLanguageDto): Promise<void>;
  setTimezone(dto: SetTimezoneDto): Promise<void>;
  setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse>;
  verifyEmail(dto: VerifyEmailDto): Promise<void>;
  resendOtp(dto: ResendOtp): Promise<OtpInfo | null>;
  updateAvatar(file: any): Promise<AvatarModel>;
  updateGravatar(): Promise<AvatarModel>;
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
