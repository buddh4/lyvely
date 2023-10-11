import { TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { buildTest } from '@/testing';
import { UserAccountsModule } from '../user-accounts.module';
import { mailTestPlugin } from '@/mails';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('account-service')
      .imports([UserAccountsModule, ThrottlerModule.forRoot()])
      .plugins([mailTestPlugin])
      .compile();
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
