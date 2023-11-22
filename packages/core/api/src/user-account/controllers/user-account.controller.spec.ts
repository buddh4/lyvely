import { TestingModule } from '@nestjs/testing';
import { UserAccountController } from './user-account.controller';
import { buildTest } from '@/testing';
import { UserAccountModule } from '../user-account.module';
import { mailTestPlugin } from '@/mails';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AccountController', () => {
  let controller: UserAccountController;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('account-service')
      .imports([UserAccountModule, ThrottlerModule.forRoot()])
      .plugins([mailTestPlugin])
      .compile();

    controller = module.get<UserAccountController>(UserAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
