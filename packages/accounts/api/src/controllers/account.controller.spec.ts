import { TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { createCoreTestingModule } from '@lyvely/testing';
import { AccountModule } from '../account.module';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await createCoreTestingModule(
      'account-service',
      [],
      [],
      [AccountModule],
    ).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
