import { IAccountService, AddEmailDto, VerifyEmailDto, OtpInfo, ResendOtpDto, useSingleton } from '@lyvely/common';
import accountRepository from '../repositories/account.repository';
import { unwrapResponse } from '@/modules/core';

export class AccountService implements IAccountService {
  async addEmail(dto: AddEmailDto) {
    return unwrapResponse(accountRepository.addEmail(dto));
  }

  async verifyEmail(dto: VerifyEmailDto) {
    return unwrapResponse(accountRepository.verifyEmail(dto));
  }

  async resendOtp(dto: ResendOtpDto) {
    return unwrapResponse(accountRepository.resendOtp(dto)).then((otpInfo) => new OtpInfo(otpInfo));
  }

  updateAvatar(file: Blob) {
    return unwrapResponse(accountRepository.updateAvatar(file));
  }

  updateGravatar() {
    return unwrapResponse(accountRepository.updateGravatar());
  }
}

export const useAccountService = useSingleton(() => new AccountService());
