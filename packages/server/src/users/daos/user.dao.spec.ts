import { expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { UserDao } from '../daos';
import { User, UserDocument, UserEmail, UserSchema } from '../schemas';
import { Model } from 'mongoose';
import { ProfileType, UserStatus } from '@lyvely/common';

describe('UserDao', () => {
  let testingModule: TestingModule;
  let userDao: UserDao;
  let userModel: Model<UserDocument>;
  let testData: TestDataUtils;

  const TEST_KEY = 'user_dao';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule('user-dao').compile();
    userDao = testingModule.get<UserDao>(UserDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    userModel = testingModule.get<Model<UserDocument>>('UserModel');
  });

  it('should be defined', () => {
    expect(userDao).toBeDefined();
  });

  async function createTestUser(email = 'test@test.de') {
    return await userDao.save(
      new User({
        username: 'Test',
        email: email,
        status: UserStatus.Active,
        locale: 'de',
        password: 'testPasswort',
      }),
    );
  }

  describe('insert()', () => {
    it('create user', async () => {
      const user = await createTestUser();
      expect(user instanceof User).toEqual(true);
      expect(user).toBeDefined();
      expect(user._id).toBeDefined();
      expect(user.id).toEqual(user._id.toString());
      expect(user.status).toEqual(UserStatus.Active);
      expect(user.profilesCount).toBeDefined();
      expect(user.profilesCount.user).toEqual(0);
      expect(user.profilesCount.group).toEqual(0);
      expect(user.profilesCount.organization).toEqual(0);
      expect(user.username).toEqual('Test');
      expect(user.email).toEqual('test@test.de');
      expect(user.locale).toEqual('de');
      expect(user.password).toBeDefined();
      // salted...
      expect(user.password).not.toEqual('testPasswort');

      expect(user.emails).toBeDefined();
      expect(user.emails[0].lowercaseEmail).toEqual(user.email);
      expect(user.emails[0].email).toEqual('test@test.de');
      expect(user.emails[0].verified).toEqual(false);
    });

    it('can not create user without password', async () => {
      try {
        await userDao.save(
          new User({
            username: 'Test',
            email: 'test@test.de',
            status: UserStatus.Active,
            locale: 'de',
          }),
        );
        expect(true).toEqual(false);
      } catch (e) {
        expect(e.errors).toBeDefined();
        expect(e.errors.password).toBeDefined();
        expect(e.errors.password.kind).toEqual('required');
      }
    });
  });

  describe('findByMainEmail()', () => {
    it('failed find user by main email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByMainEmail('test2@test.de');
      expect(searchUser).toBeNull();
    });

    it('find user by main email address', async () => {
      const user = await createTestUser('test@test.de');
      const searchUser = await userDao.findByMainEmail('test@test.de');
      expect(searchUser).toBeDefined();
      expect(searchUser instanceof User).toEqual(true);
      expect(searchUser._id.equals(user._id)).toBeDefined();
    });

    it('assure case insensitivity', async () => {
      const user = await createTestUser('test@test.de');
      const searchUser = await userDao.findByMainEmail('TEST@TEST.de');
      expect(searchUser).toBeDefined();
      expect(searchUser instanceof User).toEqual(true);
      expect(searchUser._id.equals(user._id)).toBeDefined();
    });
  });

  describe('findByAnyEmail()', () => {
    it('failed find user by any email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmail('test2@test.de');
      expect(searchUser.length).toEqual(0);
    });

    it('find user by any email address', async () => {
      const user = await createTestUser('test@test.de');
      user.emails.push(new UserEmail('test2@test.de'));
      await userDao.updateOneById(user, user);
      const searchUser = await userDao.findByAnyEmail('test2@test.de');
      expect(searchUser.length).toEqual(1);
      expect(searchUser instanceof User).toEqual(true);
      expect(searchUser[0]._id.equals(user._id)).toBeDefined();
    });

    it('assure case insensitivity', async () => {
      const user = await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmail('TEST@TEST.de');
      expect(searchUser.length).toEqual(1);
      expect(searchUser instanceof User).toEqual(true);
      expect(searchUser[0]._id.equals(user._id)).toBeDefined();
    });
  });

  describe('incrementProfileCount()', () => {
    it('increment user profile count', async () => {
      const user = await createTestUser();
      await userDao.incrementProfileCount(user, ProfileType.User);
      expect(user.profilesCount.user).toEqual(1);
      expect(user.profilesCount.group).toEqual(0);
      expect(user.profilesCount.organization).toEqual(0);

      const reloaded = await userDao.reload(user);
      expect(reloaded.profilesCount.user).toEqual(1);
      expect(reloaded.profilesCount.group).toEqual(0);
      expect(reloaded.profilesCount.organization).toEqual(0);
    });

    it('increment group profile count', async () => {
      const user = await createTestUser();
      await userDao.incrementProfileCount(user, ProfileType.Group);
      expect(user.profilesCount.user).toEqual(0);
      expect(user.profilesCount.group).toEqual(1);
      expect(user.profilesCount.organization).toEqual(0);

      const reloaded = await userDao.reload(user);
      expect(reloaded.profilesCount.user).toEqual(0);
      expect(reloaded.profilesCount.group).toEqual(1);
      expect(reloaded.profilesCount.organization).toEqual(0);
    });

    it('increment organization profile count', async () => {
      const user = await createTestUser();
      await userDao.incrementProfileCount(user, ProfileType.Organization);
      expect(user.profilesCount.user).toEqual(0);
      expect(user.profilesCount.group).toEqual(0);
      expect(user.profilesCount.organization).toEqual(1);

      const reloaded = await userDao.reload(user);
      expect(reloaded.profilesCount.user).toEqual(0);
      expect(reloaded.profilesCount.group).toEqual(0);
      expect(reloaded.profilesCount.organization).toEqual(1);
    });

    it('assure count >= 0', async () => {
      const user = await createTestUser();
      await userDao.incrementProfileCount(user, ProfileType.User, -2);
      expect(user.profilesCount.user).toEqual(0);
      expect(user.profilesCount.group).toEqual(0);
      expect(user.profilesCount.organization).toEqual(0);

      const reloaded = await userDao.reload(user);
      expect(reloaded.profilesCount.user).toEqual(0);
      expect(reloaded.profilesCount.group).toEqual(0);
      expect(reloaded.profilesCount.organization).toEqual(0);
    });
  });

  describe('setEmailVerification()', () => {
    it('set unverified email to verified', async () => {
      const user = await testData.createUser('tester', { emails: [new UserEmail('secondary@test.de', false)] });
      expect(user.getUnverifiedUserEmail('secondary@test.de')).toBeDefined();
      await userDao.setEmailVerification(user, 'secondary@test.de');
      expect(user.getVerifiedUserEmail('secondary@test.de')).toBeDefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser.getVerifiedUserEmail('secondary@test.de')).toBeDefined();
    });

    it('set verified email to unverified', async () => {
      const user = await testData.createUser('tester', { emails: [new UserEmail('secondary@test.de', true)] });
      expect(user.getVerifiedUserEmail('secondary@test.de')).toBeDefined();
      await userDao.setEmailVerification(user, 'secondary@test.de', false);
      expect(user.getUnverifiedUserEmail('secondary@test.de')).toBeDefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser.getUnverifiedUserEmail('secondary@test.de')).toBeDefined();
    });

    it('set unknown email to verified does not alter user email', async () => {
      const user = await testData.createUser('tester');
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      await userDao.setEmailVerification(user, 'secondary@test.de', true);
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser.getUserEmail('secondary@test.de')).toBeUndefined();
    });
  });

  describe('removeEmail()', () => {
    it('remove existing email', async () => {
      const user = await testData.createUser('tester', { emails: [new UserEmail('secondary@test.de')] });
      await userDao.removeEmail(user, 'secondary@test.de');
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser.getUserEmail('secondary@test.de')).toBeUndefined();
    });

    it('remove non existing email', async () => {
      const user = await testData.createUser('tester');
      await userDao.removeEmail(user, 'secondary@test.de');
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser.getUserEmail('secondary@test.de')).toBeUndefined();
    });
  });
});
