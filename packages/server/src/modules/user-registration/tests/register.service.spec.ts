import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { UserRegistrationService } from '../services/user-registration.service';
import { RegisterDto } from '@lyvely/common';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { TestDataUtils } from '../../test/utils/test-data.utils';

describe('RegisterService', () => {
  let testingModule: TestingModule;
  let registerService: UserRegistrationService;
  let testData: TestDataUtils;

  const TEST_KEY = 'register_service';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY, [UserRegistrationService]).compile();
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
      const { user, profile } = await registerService.register(
        new RegisterDto({
          username: 'Tester',
          email: 'tester@test.de',
          password: 'testpw',
          locale: 'de',
        }),
      );

      expect(profile).toBeDefined();
      expect(profile.ownerId).toBeDefined();
      expect(profile.ownerId).toEqual(user._id);
      expect(profile.name).toEqual('Tester');
      expect(profile.locale).toEqual('de');
    });

    it('register user with invalid email', async () => {
      let profile, error;

      try {
        profile = await registerService.register(
          new RegisterDto({
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
        new RegisterDto({
          username: 'TesterNew',
          email: 'tester@test.de',
          password: 'testpw',
          locale: 'de',
        }),
      );

      let profile, error;

      try {
        profile = await registerService.register(
          new RegisterDto({
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
