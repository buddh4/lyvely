import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { getDefaultLocale, RefreshToken, User, UserDocument } from '../schemas';
import { Model } from 'mongoose';
import { createBasicTestingModule, TestDataUtils } from '@/modules/test';
import { addDays } from '@lyvely/common';

describe('Users schema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let UserModel: Model<UserDocument>;

  const TEST_KEY = 'user_schema';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY).compile();
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
          refreshTokens: [
            new RefreshToken({
              vid: 'vid1',
              hash: 'someHash',
              expiration: addDays(new Date(), 1),
            }),
          ],
        }),
      );

      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.refreshTokens).toBeUndefined();
    });
  });
});
