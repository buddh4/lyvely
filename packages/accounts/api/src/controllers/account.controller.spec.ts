import { TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { buildTest } from '@lyvely/testing';
import { AccountModule } from '../account.module';
import { mailTestPlugin } from '@lyvely/mails';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('account-service')
      .imports([AccountModule, ThrottlerModule.forRoot()])
      .plugins([mailTestPlugin()])
      .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
