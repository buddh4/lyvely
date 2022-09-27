import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { PolicyService } from '../services/policy.service';
import { createBasicTestingModule, createTestExecutionContext } from "@/modules/test";
import { TestDataUtils } from "@/modules/test";
import { Policy } from '../interfaces/policy.interface';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
class TruePolicy implements Policy<Request> {
  validate(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

@Injectable()
class FalsePolicy implements Policy<Request> {
  validate(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

describe('PolicyService', () => {
  let testingModule: TestingModule;
  let policyService: PolicyService;
  let testData: TestDataUtils;

  const TEST_KEY = 'policy-service';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY,[PolicyService, TruePolicy, FalsePolicy]).compile();
    policyService = testingModule.get<PolicyService>(PolicyService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
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
      const result = await policyService.checkEvery(createTestExecutionContext(), new TruePolicy(), TruePolicy);
      expect(result).toEqual(true);
    });

    it('multiple policy checks fails', async () => {
      const result = await policyService.checkEvery(createTestExecutionContext(), TruePolicy, new FalsePolicy());
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
      const result = await policyService.checkSome(createTestExecutionContext(), new TruePolicy(), TruePolicy);
      expect(result).toEqual(true);
    });

    it('multiple policy checks fails', async () => {
      const result = await policyService.checkSome(createTestExecutionContext(), TruePolicy, new FalsePolicy());
      expect(result).toEqual(true);
    });
  });
});
