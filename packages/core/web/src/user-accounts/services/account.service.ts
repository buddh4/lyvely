import {
  IAccountService,
  AddEmailDto,
  VerifyEmailDto,
  OtpInfo,
  ResendOtp,
  SetLanguageDto,
  SetTimezoneDto,
  CalendarPreferences,
  SettingsUpdateResponse,
} from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import { accountRepository } from '../repositories';
import { unwrapAndTransformResponse, unwrapResponse } from '@/core';

export class AccountService implements IAccountService {
  async addEmail(dto: AddEmailDto) {
    return unwrapAndTransformResponse(accountRepository.addEmail(dto), OtpInfo);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    return unwrapResponse(accountRepository.verifyEmail(dto));
  }

  async resendOtp(dto: ResendOtp) {
    return unwrapAndTransformResponse(accountRepository.resendOtp(dto), OtpInfo);
  }

  updateAvatar(file: Blob) {
    return unwrapResponse(accountRepository.updateAvatar(file));
  }

  updateGravatar() {
    return unwrapResponse(accountRepository.updateGravatar());
  }

  setLanguage(dto: SetLanguageDto): Promise<void> {
    return unwrapResponse(accountRepository.setLanguage(dto));
  }

  setTimezone(dto: SetTimezoneDto): Promise<void> {
    return unwrapResponse(accountRepository.setTimezone(dto));
  }

  setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse> {
    return unwrapAndTransformResponse(
      accountRepository.setCalendarPreferences(dto),
      SettingsUpdateResponse,
    );
  }
}

export const useAccountService = useSingleton(() => new AccountService());
