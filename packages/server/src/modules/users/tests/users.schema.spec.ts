import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { getDefaultLocale, User, UserDocument } from '../schemas';
import { Model } from 'mongoose';
import { createContentTestingModule, TestDataUtils } from '@/modules/test';

describe('Users schema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let UserModel: Model<UserDocument>;

  const TEST_KEY = 'user_schema';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    UserModel = testingModule.get<Model<UserDocument>>('UserModel');
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  describe('create', () => {
    it('initial user data', async () => {
      const user = await UserModel.create(
        new User({
          username: 'Test',
          password: 'Password',
          email: 'Tester@test.de',
        }),
      );

      expect(user.username).toEqual('Test');
      expect(user.lowercaseUsername).toEqual('test');
      expect(user.password).toBeDefined();
      expect(user.password).not.toEqual('Password');
      expect(user.email).toEqual('tester@test.de');
      expect(user.enabled).toEqual(true);
      expect(user.locale).toEqual(getDefaultLocale());

      expect(user.emails).toBeDefined();
      expect(user.emails[0].lowercaseEmail).toEqual(user.email);
      expect(user.emails[0].email).toEqual('Tester@test.de');
      expect(user.emails[0].verified).toEqual(false);
    });
  });

  describe('toJSON', () => {
    it('make sure password is not exposed', async () => {
      const user = await UserModel.create(
        new User({
          username: 'Test',
          password: 'Password',
          email: 'Tester@test.de',
        }),
      );

      const json = user.toJSON();
      expect(json.password).toBeUndefined();
    });
  });
});
