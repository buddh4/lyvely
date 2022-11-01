import { IAccountService, AddEmailDto, VerifyEmailDto, OtpInfo, ResendOtpDto } from '@lyvely/common';
import accountRepository from '../repositories/account.repository';
import { unwrapEndpointRequest } from '@/modules/core';

export class AccountService implements IAccountService {
  async addEmail(dto: AddEmailDto) {
    return unwrapEndpointRequest(accountRepository.addEmail(dto));
  }

  async verifyEmail(dto: VerifyEmailDto) {
    return unwrapEndpointRequest(accountRepository.verifyEmail(dto));
  }

  async resendOtp(dto: ResendOtpDto) {
    return unwrapEndpointRequest(accountRepository.resendOtp(dto)).then((otpInfo) => new OtpInfo(otpInfo));
  }
}
