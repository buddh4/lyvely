import { createBasicTestingModule, TestDataUtils } from '@lyvely/testing';
import { TestingModule } from '@nestjs/testing';
import { expect } from '@jest/globals';
import { UserOtpModule, UserOtpService } from '../';
import { UserOtp } from '../schemas';
import ms from 'ms';
import { subtractSeconds, DEFAULT_MAX_OTP_ATTEMPTS } from '@lyvely/common';

let testingModule: TestingModule;
let testData: TestDataUtils;
let userOtpService: UserOtpService;

beforeEach(async () => {
  testingModule = await createBasicTestingModule(
    'user-otp.service',
    [],
    [],
    [UserOtpModule],
  ).compile();
  testData = testingModule.get(TestDataUtils);
  userOtpService = testingModule.get(UserOtpService);
});

it('should be defined', () => {
  expect(userOtpService).toBeDefined();
});

describe('UserOtpService', () => {
  describe('createOrUpdateUserOtp', () => {
    it('create default opt', async () => {
      const user = await testData.createUser();
      const { otp, otpModel } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
      });
      expect(otp?.length).toEqual(6);
      expect(otpModel instanceof UserOtp).toBeDefined();
      expect(otpModel._id).toBeDefined();
      expect(otpModel.attempts).toEqual(0);
      expect(otpModel.expiresIn).toEqual(ms('2m'));
    });

    it('overwrite existing opt', async () => {
      const user = await testData.createUser();
      const { otp: otp1, otpModel: model1 } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
      });
      const { otp: otp2, otpModel: model2 } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
      });

      expect(model2._id.equals(model1._id)).toEqual(true);
      expect(model2.uid.equals(model1.uid)).toEqual(true);
      expect(model2.purpose).toEqual(model2.purpose);
      expect(model2.expiresIn).toEqual(model2.expiresIn);
      expect(model2.issuedAt).not.toEqual(model1.issuedAt);
      expect(otp2).not.toEqual(otp1);
    });

    it('assure remember state is not overwritten by default', async () => {
      const user = await testData.createUser();
      await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
        remember: true,
      });
      const { otpModel } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
        remember: undefined,
      });

      expect(otpModel.remember).toEqual(true);
    });

    it('assure remember state is overwritten on update', async () => {
      const user = await testData.createUser();
      await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
        remember: true,
      });
      const { otpModel } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
        remember: false,
      });

      expect(otpModel.remember).toEqual(false);
    });
  });

  describe('createOrUpdateUserOtp', () => {
    it('find existing otp', async () => {
      const user = await testData.createUser();
      const { otpModel } = await userOtpService.createOrUpdateUserOtp(user, { purpose: 'test' });
      const searchResult = await userOtpService.findOtpByUserAndPurpose(user, 'test');
      expect(searchResult).not.toBeNull();
      expect(searchResult._id.equals(otpModel._id));
    });

    it('find non existing otp', async () => {
      const user = await testData.createUser();
      const searchResult = await userOtpService.findOtpByUserAndPurpose(user, 'test');
      expect(searchResult).toBeNull();
    });
  });

  describe('validateOtp', () => {
    it('run successful validation', async () => {
      const user = await testData.createUser();
      const { otpModel, otp } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
      });
      expect(await userOtpService.validateOtp(user, 'test', otp, otpModel)).toEqual(true);
    });

    it('validation of expired otp fails', async () => {
      const user = await testData.createUser();
      const { otpModel, otp } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
        expiresIn: '2m',
      });
      otpModel.issuedAt = subtractSeconds(new Date(), 121, false);
      expect(await userOtpService.validateOtp(user, 'test', otp, otpModel)).toEqual(false);
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

    it('run successful validation with contextValidator', async () => {
      const user = await testData.createUser();
      const { otp } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
        context: { value: 'test' },
      });
      const { isValid } = await userOtpService.runValidation(user, 'test', otp, {
        contextValidator: async (context: any) => context.value === 'test',
      });
      expect(isValid).toEqual(true);
    });

    it('run failed validation with contextValidator', async () => {
      const user = await testData.createUser();
      const { otp } = await userOtpService.createOrUpdateUserOtp(user, {
        purpose: 'test',
        context: { value: 'invalid' },
      });
      const { isValid } = await userOtpService.runValidation(user, 'test', otp, {
        contextValidator: (context: any) => context.value === 'test',
      });
      expect(isValid).toEqual(false);
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
