import { TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { createCoreTestingModule } from '@lyvely/testing';
import { AccountModule } from '../account.module';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await createCoreTestingModule(
      'account-service',
      [],
      [],
      [AccountModule],
    ).compile();
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
