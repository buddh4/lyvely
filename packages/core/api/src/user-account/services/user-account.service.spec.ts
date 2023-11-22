import { TestingModule } from '@nestjs/testing';
import { UserAccountService } from './user-account.service';
import { buildTest } from '@/testing';
import { UserAccountModule } from '../user-account.module';
import { mailTestPlugin } from '@/mails';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AccountService', () => {
  let service: UserAccountService;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('account-service')
      .imports([UserAccountModule, ThrottlerModule.forRoot()])
      .plugins([mailTestPlugin])
      .compile();
    service = module.get<UserAccountService>(UserAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
