import { AddEmailDto, VerifyEmailDto } from '../dtos';
import {
  IUserAccountClient,
  API_USER_ACCOUNT,
  UserAccountEndpoints,
} from './user-account.endpoint';
import { useApi } from '@/repository';
import { CalendarPreferences, SetLanguageDto, SetTimezoneDto } from '@/common';
import { ResendOtp } from '@/otp';

const api = useApi<IUserAccountClient>(API_USER_ACCOUNT);

export const userAccountRepository = {
  async addEmail(model: AddEmailDto) {
    return api.post<'addEmail'>(UserAccountEndpoints.ADD_EMAIL, model);
  },

  async verifyEmail(model: VerifyEmailDto) {
    return api.post<'verifyEmail'>(UserAccountEndpoints.VERIFY_EMAIL, model);
  },

  async setLanguage(model: SetLanguageDto) {
    return api.post<'setLanguage'>(UserAccountEndpoints.SET_LANGUAGE, model);
  },

  async setTimezone(model: SetTimezoneDto) {
    return api.post<'setTimezone'>(UserAccountEndpoints.SET_TIMEZONE, model);
  },

  async setCalendarPreferences(model: CalendarPreferences) {
    return api.post<'setCalendarPreferences'>(UserAccountEndpoints.SET_CALENDAR_PREFERENCES, model);
  },

  async resendOtp(model: ResendOtp) {
    return api.post<'resendOtp'>(UserAccountEndpoints.RESEND_OTP, model);
  },

  async updateAvatar(formData: any) {
    return api.post<'updateAvatar'>(UserAccountEndpoints.UPDATE_AVATAR, formData);
  },

  async updateGravatar() {
    return api.post<'updateGravatar'>(UserAccountEndpoints.UPDATE_GAVATAR);
  },
};
