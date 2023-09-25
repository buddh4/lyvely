import { TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { buildTest } from '@lyvely/testing';
import { AccountModule } from '../account.module';
import { mailTestPlugin } from '@lyvely/mails';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('account-service')
      .imports([AccountModule, ThrottlerModule.forRoot()])
      .plugins([mailTestPlugin()])
      .compile();
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
