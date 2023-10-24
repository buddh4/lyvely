import { TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { buildTest } from '@/testing';
import { UserAccountsModule } from '../user-accounts.module';
import { mailTestPlugin } from '@/mails';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('account-service')
      .imports([UserAccountsModule, ThrottlerModule.forRoot()])
      .plugins([mailTestPlugin])
      .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
