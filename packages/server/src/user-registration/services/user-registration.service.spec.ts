import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { UserRegistrationService } from './user-registration.service';
import { UserRegistrationDto, UserStatus } from '@lyvely/common';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { User } from '@/users';

describe('UserRegistrationService', () => {
  let testingModule: TestingModule;
  let registerService: UserRegistrationService;
  let testData: TestDataUtils;

  const TEST_KEY = 'register_service';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [UserRegistrationService]).compile();
    registerService = testingModule.get<UserRegistrationService>(UserRegistrationService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    return testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });

  describe('register', () => {
    it('register valid user', async () => {
      const user = await registerService.register(
        new UserRegistrationDto({
          username: 'Tester',
          email: 'tester@test.de',
          password: 'testpw',
          remember: true,
          locale: 'de-DE',
        }),
      );

      expect(user).toBeDefined();
      expect(user instanceof User).toEqual(true);
      expect(user.username).toEqual('Tester');
      expect(user.email).toEqual('tester@test.de');
      expect(user.locale).toEqual('de-DE');
      expect(user.status).toEqual(UserStatus.EmailVerification);
    });

    it('register user with invalid email', async () => {
      let profile, error;

      try {
        profile = await registerService.register(
          new UserRegistrationDto({
            username: 'Tester',
            email: 'testertest.de',
            password: 'testpw',
            locale: 'de',
          }),
        );
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(profile).toBeUndefined();
    });

    it('register already existing email', async () => {
      await registerService.register(
        new UserRegistrationDto({
          username: 'TesterNew',
          email: 'tester@test.de',
          password: 'testpw',
          locale: 'de',
        }),
      );

      let profile, error;

      try {
        profile = await registerService.register(
          new UserRegistrationDto({
            username: 'Tester',
            email: 'tester@test.de',
            password: 'testpw',
            locale: 'de',
          }),
        );
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(profile).toBeUndefined();
    });
  });
});
