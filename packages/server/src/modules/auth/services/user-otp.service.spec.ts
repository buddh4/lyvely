import { createBasicTestingModule, TestDataUtils } from '@/modules/test';
import { TestingModule } from '@nestjs/testing';
import { expect } from '@jest/globals';
import { DEFAULT_MAX_OTP_ATTEMPTS, UserOtpService } from '@/modules/auth/services/user-otp.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserOtp } from '@/modules/auth/schemas/user-otp.schema';
import ms from 'ms';

let testingModule: TestingModule;
let testData: TestDataUtils;
let userOtpService: UserOtpService;

beforeEach(async () => {
  testingModule = await createBasicTestingModule('user-otp.service', [], [], [AuthModule]).compile();
  testData = testingModule.get(TestDataUtils);
  userOtpService = testingModule.get(UserOtpService);
});

it('shoul be defined', () => {
  expect(userOtpService).toBeDefined();
});

describe('UserOtpService', () => {
  describe('createOrUpdateUserOtp', () => {
    it('create default opt', async () => {
      const user = await testData.createUser();
      const { otp, model } = await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      expect(otp?.length).toEqual(6);
      expect(model instanceof UserOtp).toBeDefined();
      expect(model._id).toBeDefined();
      expect(model.attempts).toEqual(0);
      expect(model.expiresIn).toEqual(ms('2m'));
    });

    it('overwrite existing opt', async () => {
      const user = await testData.createUser();
      const { otp: otp1, model: model1 } = await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      const { otp: otp2, model: model2 } = await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });

      expect(model2._id.equals(model1._id)).toEqual(true);
      expect(model2.uid.equals(model1.uid)).toEqual(true);
      expect(model2.purpose).toEqual(model2.purpose);
      expect(model2.expiresIn).toEqual(model2.expiresIn);
      expect(model2.issuedAt).not.toEqual(model1.issuedAt);
      expect(otp2).not.toEqual(otp1);
    });
  });

  describe('createOrUpdateUserOtp', () => {
    it('find existing otp', async () => {
      const user = await testData.createUser();
      const { model } = await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      const searchResult = await userOtpService.findOtpByUserAndPurpose(user, 'test');
      expect(searchResult).not.toBeNull();
      expect(searchResult._id.equals(model._id));
    });

    it('find non existing otp', async () => {
      const user = await testData.createUser();
      const searchResult = await userOtpService.findOtpByUserAndPurpose(user, 'test');
      expect(searchResult).toBeNull();
    });
  });

  describe('runValidation', () => {
    it('run successful otp validation', async () => {
      const user = await testData.createUser();
      const { otp } = await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      const { isValid, attempts } = await userOtpService.runValidation(user, 'test', otp);
      expect(isValid).toEqual(true);
      expect(attempts).toEqual(0);
    });

    it('otp is invalidated after successful validation', async () => {
      const user = await testData.createUser();
      const { otp } = await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      const { isValid } = await userOtpService.runValidation(user, 'test', otp);
      const searchOtp = await userOtpService.findOtpByUserAndPurpose(user, 'test');
      expect(isValid).toEqual(true);
      expect(searchOtp).toBeNull();
    });

    it('run invalid otp validation', async () => {
      const user = await testData.createUser();
      await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      const { isValid } = await userOtpService.runValidation(user, 'test', 'abcabc');
      expect(isValid).toEqual(false);
      expect(isValid).toEqual(false);
    });

    it('run invalid otp validation', async () => {
      const user = await testData.createUser();
      await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      const { isValid, attempts } = await userOtpService.runValidation(user, 'test', 'abcabc');
      expect(isValid).toEqual(false);
      expect(attempts).toEqual(3);
    });

    it('run out of attempts', async () => {
      const user = await testData.createUser();
      await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      let result;
      for (let i = 1; i <= DEFAULT_MAX_OTP_ATTEMPTS; i++) {
        result = await userOtpService.runValidation(user, 'test', 'abcabc');
        expect(result.isValid).toEqual(false);
        expect(result.attempts).toEqual(DEFAULT_MAX_OTP_ATTEMPTS - i);
      }
      const searchOtp = await userOtpService.findOtpByUserAndPurpose(user, 'test');

      expect(result.isValid).toEqual(false);
      expect(result.attempts).toEqual(0);
      expect(searchOtp).toBeNull();
    });
  });
});
