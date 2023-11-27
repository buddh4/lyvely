import { StrictEndpoint } from '@/endpoints';
import { AvatarModel } from '@/avatars';
import { AddEmailDto, VerifyEmailDto } from '../dtos';
import { CalendarPreferences, SetLanguageDto, SetTimezoneDto } from '@/common';
import { ResendOtp, OtpInfo } from '@/otp';
import { SettingsUpdateResponse } from '@/settings';

export interface IUserAccountClient {
  addEmail(dto: AddEmailDto): Promise<OtpInfo>;
  setLanguage(dto: SetLanguageDto): Promise<void>;
  setTimezone(dto: SetTimezoneDto): Promise<void>;
  setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse>;
  verifyEmail(dto: VerifyEmailDto): Promise<void>;
  resendOtp(dto: ResendOtp): Promise<OtpInfo | null>;
  updateAvatar(file: any): Promise<AvatarModel>;
  updateGravatar(): Promise<AvatarModel>;
}

export const ENDPOINT_USER_ACCOUNT = 'account';
export type UserAccountEndpoint = StrictEndpoint<IUserAccountClient>;

export const UserAccountEndpointPaths = {
  ADD_EMAIL: 'add-email',
  VERIFY_EMAIL: 'verify-email',
  SET_LANGUAGE: 'set-language',
  SET_TIMEZONE: 'set-timezone',
  SET_CALENDAR_PREFERENCES: 'set-calendar-preferences',
  RESEND_OTP: 'resend-otp',
  UPDATE_AVATAR: 'update-avatar',
  UPDATE_GAVATAR: 'update-gravatar',
};
