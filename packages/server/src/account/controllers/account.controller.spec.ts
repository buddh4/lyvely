import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { expect } from '@jest/globals';
import { createBasicTestingModule } from '@/test';
import { AccountModule } from '@/account/accountModule';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await createBasicTestingModule('account-service', [], [], [AccountModule]).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
