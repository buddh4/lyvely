import { SetLanguageDto, SetTimezoneDto, CalendarPreferences } from '@/common';
import { AddEmailDto, VerifyEmailDto } from '../dtos';
import { OtpInfo, ResendOtp } from '@/otp';
import { IUserAccountClient } from './user-account.endpoint';
import { useSingleton } from '@lyvely/common';
import { userAccountRepository } from './user-account.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/endpoints';
import { SettingsUpdateResponse } from '@/settings';

export class UserAccountClient implements IUserAccountClient {
  async addEmail(dto: AddEmailDto) {
    return unwrapAndTransformResponse(userAccountRepository.addEmail(dto), OtpInfo);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    return unwrapResponse(userAccountRepository.verifyEmail(dto));
  }

  async resendOtp(dto: ResendOtp) {
    return unwrapAndTransformResponse(userAccountRepository.resendOtp(dto), OtpInfo);
  }

  async updateAvatar(formData: any) {
    return unwrapResponse(userAccountRepository.updateAvatar(formData));
  }

  async updateGravatar() {
    return unwrapResponse(userAccountRepository.updateGravatar());
  }

  async setLanguage(dto: SetLanguageDto): Promise<void> {
    return unwrapResponse(userAccountRepository.setLanguage(dto));
  }

  async setTimezone(dto: SetTimezoneDto): Promise<void> {
    return unwrapResponse(userAccountRepository.setTimezone(dto));
  }

  async setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse> {
    return unwrapAndTransformResponse(
      userAccountRepository.setCalendarPreferences(dto),
      SettingsUpdateResponse
    );
  }
}

export const useUserAccountClient = useSingleton(() => new UserAccountClient());
