import { TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { expect } from '@jest/globals';
import { createBasicTestingModule } from '@lyvely/testing';
import { AccountModule } from '../account.module';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await createBasicTestingModule('account-service', [], [], [AccountModule]).compile();
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});