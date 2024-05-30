import { buildUserTest, ProfilesCount, RefreshToken, UserEmail, UsersService } from '../index';
import { getObjectId, ILyvelyTestingModule } from '@/testing';
import { addDays, addMinutes } from '@lyvely/dates';
import { ProfileType } from '@lyvely/interface';
import { compare } from 'bcrypt';
import { UserTestDataUtils } from '../testing';

describe('UserService', () => {
  let userService: UsersService;
  let testingModule: ILyvelyTestingModule;
  let testData: UserTestDataUtils;

  beforeEach(async () => {
    testingModule = await buildUserTest('UserService').compile();
    userService = testingModule.get(UsersService);
    testData = testingModule.get(UserTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findUserByMainEmail', () => {
    it('find existing user by main email', async () => {
      const user = await testData.createUser('testUser', { email: 'test@test.de' });
      const searchUser = await userService.findUserByMainEmail('test@test.de');
      expect(searchUser).toBeDefined();
      expect(searchUser!._id.equals(user._id)).toEqual(true);
    });

    it('find non existing user by main email', async () => {
      await testData.createUser('testUser', { email: 'test@test.de' });
      const searchUser = await userService.findUserByMainEmail('test123@test.de');
      expect(searchUser).toBeNull();
    });

    it('assure secondary emails are ignored', async () => {
      await testData.createUser('testUser', {
        email: 'test@test.de',
        emails: [new UserEmail('test2@test.de')],
      });
      const searchUser = await userService.findUserByMainEmail('test2@test.de');
      expect(searchUser).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('find existing user by ObjectId', async () => {
      const user = await testData.createUser();
      const searchUser = await userService.findUserById(user._id);
      expect(searchUser).toBeDefined();
      expect(searchUser!._id.equals(user._id)).toEqual(true);
    });

    it('find existing user by string id', async () => {
      const user = await testData.createUser();
      const searchUser = await userService.findUserById(user.id);
      expect(searchUser).toBeDefined();
      expect(searchUser!._id.equals(user._id)).toEqual(true);
    });

    it('find non existing user by main email', async () => {
      await testData.createUser();
      const searchUser = await userService.findUserById(getObjectId('nonExisting'));
      expect(searchUser).toBeNull();
    });
  });

  describe('incrementProfileCount', () => {
    it('increment user profile count', async () => {
      const user = await testData.createUser();
      expect(user.profilesCount.user).toEqual(0);
      await userService.incrementProfileCount(user, ProfileType.User);
      expect(user.profilesCount.user).toEqual(1);
      expect((await userService.findUserById(user))!.profilesCount.user).toEqual(1);
    });

    it('increment group profile count', async () => {
      const user = await testData.createUser();
      expect(user.profilesCount.group).toEqual(0);
      await userService.incrementProfileCount(user, ProfileType.Group);
      expect(user.profilesCount.group).toEqual(1);
      expect((await userService.findUserById(user))!.profilesCount.group).toEqual(1);
    });

    it('increment organization profile count', async () => {
      const user = await testData.createUser();
      expect(user.profilesCount.organization).toEqual(0);
      await userService.incrementProfileCount(user, ProfileType.Organization);
      expect(user.profilesCount.organization).toEqual(1);
      expect((await userService.findUserById(user))!.profilesCount.organization).toEqual(1);
    });
  });

  describe('decrementProfileCount', () => {
    it('decrement user profile count', async () => {
      const user = await testData.createUser('userxy', {
        profilesCount: new ProfilesCount({ user: 5 }),
      });
      expect(user.profilesCount.user).toEqual(5);
      await userService.decrementProfileCount(user, ProfileType.User);
      expect(user.profilesCount.user).toEqual(4);
      expect((await userService.findUserById(user))!.profilesCount.user).toEqual(4);
    });

    it('decrement group profile count', async () => {
      const user = await testData.createUser('userxy', {
        profilesCount: new ProfilesCount({ group: 5 }),
      });
      expect(user.profilesCount.group).toEqual(5);
      await userService.decrementProfileCount(user, ProfileType.Group);
      expect(user.profilesCount.group).toEqual(4);
      expect((await userService.findUserById(user))!.profilesCount.group).toEqual(4);
    });

    it('decrement organization profile count', async () => {
      const user = await testData.createUser('userxy', {
        profilesCount: new ProfilesCount({ organization: 5 }),
      });
      expect(user.profilesCount.organization).toEqual(5);
      await userService.decrementProfileCount(user, ProfileType.Organization);
      expect(user.profilesCount.organization).toEqual(4);
      expect((await userService.findUserById(user))!.profilesCount.organization).toEqual(4);
    });
  });

  describe('setRefreshTokenHash', () => {
    it('set new refresh token', async () => {
      const user = await testData.createUser();
      expect(user.refreshTokens.length).toEqual(0);
      await userService.setRefreshToken(
        user,
        new RefreshToken({
          vid: 'vid1',
          hash: 'someHash',
          expiration: addDays(new Date(), 1),
          remember: true,
        })
      );
      expect(user.refreshTokens.length).toEqual(1);
      const persistedUser = await userService.findUserById(user);

      expect(persistedUser!.refreshTokens.length).toEqual(1);
      expect(persistedUser!.refreshTokens[0].remember).toEqual(true);
      expect(persistedUser!.refreshTokens[0].vid).toEqual('vid1');
      expect(persistedUser!.refreshTokens[0].hash).toEqual('someHash');
    });

    it('update refresh token', async () => {
      const vid = 'vid1';
      const user = await testData.createUser('user1', {
        refreshTokens: [
          new RefreshToken({
            vid: vid,
            hash: 'someHash',
            expiration: addDays(new Date(), 1),
            remember: true,
          }),
        ],
      });

      expect(user.refreshTokens.length).toEqual(1);
      expect(user.refreshTokens[0].hash).toEqual('someHash');

      await userService.setRefreshToken(
        user,
        new RefreshToken({
          vid: vid,
          hash: 'someNewHash',
          expiration: addDays(new Date(), 1),
        })
      );

      expect(user.refreshTokens.length).toEqual(1);
      expect(user.refreshTokens[0].hash).toEqual('someNewHash');

      const persistedUser = await userService.findUserById(user);
      expect(persistedUser!.refreshTokens.length).toEqual(1);
      expect(persistedUser!.refreshTokens[0].hash).toEqual('someNewHash');
    });
  });

  describe('destroyRefreshToken', () => {
    it('destroy existing refresh token', async () => {
      const vid = 'vid1';
      const user = await testData.createUser('user1', {
        refreshTokens: [
          new RefreshToken({
            vid: vid,
            hash: 'someHash',
            expiration: addDays(new Date(), 1),
          }),
        ],
      });

      expect(await userService.destroyRefreshToken(user, vid)).toEqual(true);
      expect(user.refreshTokens.length).toEqual(0);
      expect((await userService.findUserById(user))!.refreshTokens.length).toEqual(0);
    });

    it('destroy non existing refresh token', async () => {
      const vid = 'vid1';
      const user = await testData.createUser('user1', {
        refreshTokens: [
          new RefreshToken({
            vid: vid,
            hash: 'someHash',
            expiration: addDays(new Date(), 1),
          }),
        ],
      });

      expect(await userService.destroyRefreshToken(user, 'nonExisting')).toEqual(true);
      expect(user.refreshTokens.length).toEqual(1);
    });
  });

  describe('destroyExpiredRefreshToken', () => {
    it('destroy expired refresh token', async () => {
      const user = await testData.createUser('user1', {
        refreshTokens: [
          new RefreshToken({
            vid: 'vid1',
            hash: 'someHash',
            expiration: addDays(new Date(), -1),
          }),
        ],
      });

      await userService.destroyExpiredRefreshTokens(user);
      expect(user.refreshTokens.length).toEqual(0);
      const persistedUser = await userService.findUserById(user);
      expect(persistedUser!.refreshTokens.length).toEqual(0);
    });

    it('do not destroy non expired refresh token', async () => {
      const user = await testData.createUser('user1', {
        refreshTokens: [
          new RefreshToken({
            vid: 'vid1',
            hash: 'someHash1',
            expiration: addMinutes(new Date(), 1),
          }),
          new RefreshToken({
            vid: 'vid2',
            hash: 'someHash2',
            expiration: addMinutes(new Date(), -1),
          }),
        ],
      });

      await userService.destroyExpiredRefreshTokens(user);
      expect(user.refreshTokens.length).toEqual(1);
      const persistedUser = await userService.findUserById(user);
      expect(persistedUser!.refreshTokens.length).toEqual(1);
      expect(persistedUser!.refreshTokens[0].vid).toEqual('vid1');
      expect(persistedUser!.refreshTokens[0].hash).toEqual('someHash1');
    });
  });

  describe('setUserPassword', () => {
    it('reset user password with session reset', async () => {
      const user = await testData.createUser();
      const currentPassword = user.password;
      await userService.setUserPassword(user, 'newPassword', true);
      expect(user.password).not.toEqual(currentPassword);
      expect(user.password).not.toEqual('newPassword');
      const updated = await userService.findUserById(user);
      expect(await compare('newPassword', updated!.password)).toEqual(true);
      expect(updated!.passwordResetAt instanceof Date).toEqual(true);
      expect(updated!.sessionResetAt instanceof Date).toEqual(true);
      expect(updated!.passwordResetAt).toEqual(updated!.sessionResetAt);
    });

    it('reset user password without session reset', async () => {
      const user = await testData.createUser();
      const currentPassword = user.password;
      await userService.setUserPassword(user, 'newPassword', false);
      expect(user.password).not.toEqual(currentPassword);
      expect(user.password).not.toEqual('newPassword');
      const updated = await userService.findUserById(user);
      expect(await compare('newPassword', updated!.password)).toEqual(true);
      expect(updated!.sessionResetAt).toBeUndefined();
      expect(updated!.passwordResetAt instanceof Date).toEqual(true);
    });
  });
});
