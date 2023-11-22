import {
  AddEmailDto,
  VerifyEmailDto,
  IAccountService,
  ENDPOINT_ACCOUNT,
  ResendOtp,
  SetLanguageDto,
  CalendarPreferences,
  SetTimezoneDto,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

const resource = ENDPOINT_ACCOUNT;

export const accountRepository = {
  async addEmail(model: AddEmailDto) {
    return useApiRepository().post<EndpointResult<IAccountService['addEmail']>>(
      `${resource}/add-email`,
      model,
    );
  },

  async verifyEmail(model: VerifyEmailDto) {
    return useApiRepository().post<EndpointResult<IAccountService['verifyEmail']>>(
      `${resource}/verify-email`,
      model,
    );
  },

  async setLanguage(model: SetLanguageDto) {
    return useApiRepository().post<EndpointResult<IAccountService['setLanguage']>>(
      `${resource}/set-language`,
      model,
    );
  },

  async setTimezone(model: SetTimezoneDto) {
    return useApiRepository().post<EndpointResult<IAccountService['setLanguage']>>(
      `${resource}/set-timezone`,
      model,
    );
  },

  async setCalendarPreferences(model: CalendarPreferences) {
    return useApiRepository().post<EndpointResult<IAccountService['setCalendarPreferences']>>(
      `${resource}/set-calendar-preferences`,
      model,
    );
  },

  async resendOtp(model: ResendOtp) {
    return useApiRepository().post<EndpointResult<IAccountService['resendOtp']>>(
      `${resource}/resend-otp`,
      model,
    );
  },

  async updateAvatar(fileData: Blob) {
    const file = new File([fileData], 'avatar.jpeg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', file, 'avatar.jpeg');
    return useApiRepository().post<EndpointResult<IAccountService['updateAvatar']>>(
      `${resource}/update-avatar`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  async updateGravatar() {
    return useApiRepository().post<EndpointResult<IAccountService['updateGravatar']>>(
      `${resource}/update-gravatar`,
    );
  },
};
