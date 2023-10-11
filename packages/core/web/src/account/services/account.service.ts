import {
  IAccountService,
  AddEmailDto,
  VerifyEmailDto,
  OtpInfo,
  ResendOtp,
} from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import accountRepository from '../repositories/account.repository';
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
}

export const useAccountService = useSingleton(() => new AccountService());
