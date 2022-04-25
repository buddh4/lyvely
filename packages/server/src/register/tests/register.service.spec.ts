import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { RegisterService } from '../register.service';
import { RegisterDto } from 'lyvely-common';
import { createTestingModule } from "../../test/utils/test.utils";
import { TestDataUtils } from "../../test/utils/test-data.utils";

describe('RegisterService', () => {
  let testingModule: TestingModule;
  let registerService: RegisterService;
  let testData: TestDataUtils;

  const TEST_KEY = 'register_service';

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY, [RegisterService]).compile();
    registerService = testingModule.get<RegisterService>(RegisterService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    return testData.reset(TEST_KEY);
  })

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });

  describe('register', () => {
    it('register valid user', async () => {
      const { user, profile } = await registerService.register(new RegisterDto({
        username: 'Tester',
        email: 'tester@test.de',
        password: 'testpw',
        locale: 'de',
      }));

      expect(profile).toBeDefined();
      expect(profile.createdBy).toBeDefined();
      expect(profile.createdBy).toEqual(user._id);
      expect(profile.name).toEqual('Tester');
      expect(profile.locale).toEqual('de');
    });

    it('register user with invalid email', async () => {
      let profile;

      try {
        profile = await registerService.register(new RegisterDto({
          username: 'Tester',
          email: 'testertest.de',
          password: 'testpw',
          locale: 'de',
        }));
      } catch (err) {
        // Nothing todo
      }

      expect(profile).toBeUndefined();
    });
  });
});
