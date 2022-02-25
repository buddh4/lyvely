import { expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../../test/utils/mongoose-test.utils';
import { RegisterService } from '../register.service';
import { UsersModule } from '../../users/users.module';
import { ProfilesModule } from '../../profiles/profiles.module';
import { RegisterDto } from 'lyvely-common';

describe('RegisterService', () => {
  let testingModule: TestingModule;
  let registerService: RegisterService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('users service'),
        UsersModule,
        ProfilesModule,
      ],
      providers: [RegisterService],
    }).compile();

    registerService = testingModule.get<RegisterService>(RegisterService);
  });

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
