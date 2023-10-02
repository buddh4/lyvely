import { PolicyService } from './policy.service';
import { buildTest, createTestExecutionContext, LyvelyTestingModule } from '@lyvely/testing';
import { IPolicy } from '../interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
class TruePolicy implements IPolicy<any> {
  validate(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

@Injectable()
class FalsePolicy implements IPolicy<any> {
  validate(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

describe('PolicyService', () => {
  let testingModule: LyvelyTestingModule;
  let policyService: PolicyService;

  const TEST_KEY = 'policy-service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .providers([PolicyService, TruePolicy, FalsePolicy])
      .compile();
    policyService = testingModule.get<PolicyService>(PolicyService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(policyService).toBeDefined();
  });

  describe('check()', () => {
    it('single policy check fails', async () => {
      const result = await policyService.check(createTestExecutionContext(), new FalsePolicy());
      expect(result).toEqual(false);
    });

    it('single policy check succeeds', async () => {
      const result = await policyService.check(createTestExecutionContext(), new TruePolicy());
      expect(result).toEqual(true);
    });

    it('single type policy check succeeds', async () => {
      const result = await policyService.check(createTestExecutionContext(), TruePolicy);
      expect(result).toEqual(true);
    });
  });

  describe('checkEvery()', () => {
    it('multiple policy checks succeed', async () => {
      const result = await policyService.checkEvery(
        createTestExecutionContext(),
        new TruePolicy(),
        TruePolicy,
      );
      expect(result).toEqual(true);
    });

    it('multiple policy checks fails', async () => {
      const result = await policyService.checkEvery(
        createTestExecutionContext(),
        TruePolicy,
        new FalsePolicy(),
      );
      expect(result).toEqual(false);
    });
  });

  describe('validateSome()', () => {
    it('single policy check fails', async () => {
      const result = await policyService.checkSome(createTestExecutionContext(), new FalsePolicy());
      expect(result).toEqual(false);
    });

    it('single policy check succeeds', async () => {
      const result = await policyService.checkSome(createTestExecutionContext(), new TruePolicy());
      expect(result).toEqual(true);
    });

    it('multiple policy checks succeed', async () => {
      const result = await policyService.checkSome(
        createTestExecutionContext(),
        new TruePolicy(),
        TruePolicy,
      );
      expect(result).toEqual(true);
    });

    it('multiple policy checks fails', async () => {
      const result = await policyService.checkSome(
        createTestExecutionContext(),
        TruePolicy,
        new FalsePolicy(),
      );
      expect(result).toEqual(true);
    });
  });
});
