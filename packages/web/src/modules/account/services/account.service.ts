import { IAccountService, AddEmailDto, VerifyEmailDto } from '@lyvely/common';
import accountRepository from '../repositories/account.repository';

export class AccountService implements IAccountService {
  async addEmail(dto: AddEmailDto) {
    return accountRepository.addEmail(dto);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    return accountRepository.verifyEmail(dto);
  }
}
