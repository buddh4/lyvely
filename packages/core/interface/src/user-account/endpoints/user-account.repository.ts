import { AddEmailDto, VerifyEmailDto } from '../dtos';
import {
  IUserAccountClient,
  ENDPOINT_USER_ACCOUNT,
  UserAccountEndpointPaths,
} from './user-account.endpoint';
import { useApi } from '@/repository';
import { CalendarPreferences, SetLanguageDto, SetTimezoneDto } from '@/common';
import { ResendOtp } from '@/otp';

const api = useApi<IUserAccountClient>(ENDPOINT_USER_ACCOUNT);

export const userAccountRepository = {
  async addEmail(model: AddEmailDto) {
    return api.post<'addEmail'>(UserAccountEndpointPaths.ADD_EMAIL, model);
  },

  async verifyEmail(model: VerifyEmailDto) {
    return api.post<'verifyEmail'>(UserAccountEndpointPaths.VERIFY_EMAIL, model);
  },

  async setLanguage(model: SetLanguageDto) {
    return api.post<'setLanguage'>(UserAccountEndpointPaths.SET_LANGUAGE, model);
  },

  async setTimezone(model: SetTimezoneDto) {
    return api.post<'setTimezone'>(UserAccountEndpointPaths.SET_TIMEZONE, model);
  },

  async setCalendarPreferences(model: CalendarPreferences) {
    return api.post<'setCalendarPreferences'>(
      UserAccountEndpointPaths.SET_CALENDAR_PREFERENCES,
      model,
    );
  },

  async resendOtp(model: ResendOtp) {
    return api.post<'resendOtp'>(UserAccountEndpointPaths.RESEND_OTP, model);
  },

  async updateAvatar(formData: any) {
    return api.post<'updateAvatar'>(UserAccountEndpointPaths.UPDATE_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async updateGravatar() {
    return api.post<'updateGravatar'>(UserAccountEndpointPaths.UPDATE_GAVATAR);
  },
};
