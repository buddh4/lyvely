import { buildUserTest, UserTestDataUtils } from '../testing';
import { UserDao } from '../daos';
import { RefreshToken, User, UserEmail } from '../schemas';
import { UserStatus, ProfileType } from '@lyvely/interface';
import { addMinutes } from '@lyvely/dates';
import { ILyvelyTestingModule } from '@/testing';

describe('UserDao', () => {
  let testingModule: ILyvelyTestingModule;
  let userDao: UserDao;
  let testData: UserTestDataUtils;

  beforeEach(async () => {
    testingModule = await buildUserTest('user-dao').compile();
    userDao = testingModule.get<UserDao>(UserDao);
    testData = testingModule.get<UserTestDataUtils>(UserTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  async function createTestUser(email = 'test@test.de', username = 'Test') {
    return await userDao.save(
      new User({
        username,
        email,
        status: UserStatus.Active,
        locale: 'de',
        password: 'testPasswort',
        emails: [
          new UserEmail(email, true),
          new UserEmail('new_' + email, false),
          new UserEmail('alt_' + email, true),
        ],
      })
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
      expect(user.emails[0].email).toEqual('test@test.de');
      expect(user.emails[0].verified).toEqual(true);
    });

    it('can not create user without password', async () => {
      try {
        await userDao.save(
          new User({
            username: 'Test',
            email: 'test@test.de',
            status: UserStatus.Active,
            locale: 'de',
          })
        );
        expect(true).toEqual(false);
      } catch (e: any) {
        expect(e.errors).toBeDefined();
        expect(e.errors.password).toBeDefined();
        expect(e.errors.password.kind).toEqual('required');
      }
    });
  });

  describe('findByUsername()', () => {
    it('find user by username', async () => {
      await createTestUser('test@test.de', 'testuser');
      const searchUser = await userDao.findByUsername('testuser');
      expect(searchUser).toBeDefined();
    });

    it('find user by case insensitive username', async () => {
      await createTestUser('test@test.de', 'testuser');
      const searchUser = await userDao.findByUsername('TestUser');
      expect(searchUser).toBeDefined();
    });

    it('do not find wrong', async () => {
      await createTestUser('test@test.de', 'testuser');
      const searchUser = await userDao.findByUsername('testuser_');
      expect(searchUser).toBeNull();
    });
  });

  describe('findByMainEmail()', () => {
    it('failed find user by main email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByMainEmail('test2@test.de');
      expect(searchUser).toBeNull();
    });

    it('do not find secondary email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByMainEmail('new_test@test.de');
      expect(searchUser).toBeNull();
    });

    it('find user by main email address', async () => {
      const user = await createTestUser('test@test.de');
      const searchUser = await userDao.findByMainEmail('test@test.de');
      expect(searchUser).toBeDefined();
      expect(searchUser instanceof User).toEqual(true);
      expect(searchUser?._id.equals(user._id)).toBeDefined();
    });

    it('assure case insensitivity', async () => {
      const user = await createTestUser('test@test.de');
      const searchUser = await userDao.findByMainEmail('TEST@TEST.de');
      expect(searchUser).toBeDefined();
      expect(searchUser instanceof User).toEqual(true);
      expect(searchUser?._id.equals(user._id)).toBeDefined();
    });
  });

  describe('findByVerifiedEmail()', () => {
    it('find user by verified email', async () => {
      const user = await testData.createUser('test', {
        emails: [new UserEmail('secondary@test.de', true)],
      });
      const search = await userDao.findByVerifiedEmail('secondary@test.de');
      expect(search).toBeDefined();
      expect(search?._id).toEqual(user._id);
    });

    it('do not include unverified emails', async () => {
      await testData.createUser('test', { emails: [new UserEmail('secondary@test.de', false)] });
      const search = await userDao.findByVerifiedEmail('secondary@test.de');
      expect(search).toBeNull();
    });

    it('do not include users with unverified main email', async () => {
      await testData.createUser('test', {
        status: UserStatus.EmailVerification,
        email: 'test@test.de',
        emails: [new UserEmail('test@test.de', false)],
      });
      const search = await userDao.findByVerifiedEmail('test@test.de');
      expect(search).toBeNull();
    });

    it('do include users with unverified main email if flag is set', async () => {
      await testData.createUser('test', {
        status: UserStatus.EmailVerification,
        email: 'test@test.de',
      });
      const search = await userDao.findByVerifiedEmail('test@test.de', true);
      expect(search).toBeDefined();
    });

    it('do include main email', async () => {
      const user = await testData.createUser('test', {
        email: 'test@test.de',
      });
      const search = await userDao.findByVerifiedEmail('test@test.de');
      expect(search).toBeDefined();
      expect(search?._id).toEqual(user._id);
    });
  });

  describe('findByVerifiedEmails()', () => {
    it('find user by verified email', async () => {
      await testData.createUser('test', {
        emails: [new UserEmail('secondary@test.de', true)],
      });
      const search = await userDao.findByVerifiedEmails(['secondary@test.de']);
      expect(search.length).toEqual(1);
    });

    it('do not include unverified emails', async () => {
      await testData.createUser('test', { emails: [new UserEmail('secondary@test.de', false)] });
      const search = await userDao.findByVerifiedEmails(['secondary@test.de']);
      expect(search.length).toEqual(0);
    });

    it('do not include users with unverified main email', async () => {
      await testData.createUser('test', {
        status: UserStatus.EmailVerification,
        email: 'test@test.de',
        emails: [new UserEmail('test@test.de', false)],
      });
      const search = await userDao.findByVerifiedEmails(['test@test.de']);
      expect(search.length).toEqual(0);
    });

    it('do include main email', async () => {
      await testData.createUser('test', {
        email: 'test@test.de',
      });
      const search = await userDao.findByVerifiedEmails(['test@test.de']);
      expect(search.length).toEqual(1);
    });
  });

  describe('findByAnyEmails()', () => {
    it('failed find user by any email attempt', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmails(['test2@test.de']);
      expect(searchUser.length).toEqual(0);
    });

    it('find user by secondary verified email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmails(['ALT_test@test.de']);
      expect(searchUser.length).toEqual(1);
    });

    it('find user by secondary unverified email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmails(['NEW_test@test.de']);
      expect(searchUser.length).toEqual(1);
    });

    it('find user by any email address', async () => {
      const user = await createTestUser('test@test.de');
      user.emails.push(new UserEmail('test2@test.de'));
      await userDao.updateOneById(user, user);
      const searchUser = await userDao.findByAnyEmails(['test2@test.de']);
      expect(searchUser.length).toEqual(1);
      expect(searchUser[0] instanceof User).toEqual(true);
      expect(searchUser[0]._id.equals(user._id)).toBeDefined();
    });

    it('assure case insensitivity', async () => {
      const user = await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmails(['TEST@TEST.de']);
      expect(searchUser.length).toEqual(1);
      expect(searchUser[0] instanceof User).toEqual(true);
      expect(searchUser[0]._id.equals(user._id)).toBeDefined();
    });
  });

  describe('findByAnyEmail()', () => {
    it('failed find user by any email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmail('test2@test.de');
      expect(searchUser.length).toEqual(0);
    });

    it('find user by secondary verified email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmail('ALT_test@test.de');
      expect(searchUser.length).toEqual(1);
    });

    it('find user by secondary unverified email', async () => {
      await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmail('NEW_test@test.de');
      expect(searchUser.length).toEqual(1);
    });

    it('find user by any email address', async () => {
      const user = await createTestUser('test@test.de');
      user.emails.push(new UserEmail('test2@test.de'));
      await userDao.updateOneById(user, user);
      const searchUser = await userDao.findByAnyEmail('test2@test.de');
      expect(searchUser.length).toEqual(1);
      expect(searchUser[0] instanceof User).toEqual(true);
      expect(searchUser[0]._id.equals(user._id)).toBeDefined();
    });

    it('assure case insensitivity', async () => {
      const user = await createTestUser('test@test.de');
      const searchUser = await userDao.findByAnyEmail('TEST@TEST.de');
      expect(searchUser.length).toEqual(1);
      expect(searchUser[0] instanceof User).toEqual(true);
      expect(searchUser[0]._id.equals(user._id)).toBeDefined();
    });
  });

  describe('setEmailVerification()', () => {
    it('verify main email', async () => {
      const user = await testData.createUser('tester', {
        email: 'test@test.de',
        emails: [new UserEmail(`tester@test.de`, false)],
      });
      expect(user.getUnverifiedUserEmail('tester@test.de')).toBeDefined();
      await userDao.setEmailVerification(user, 'tester@test.de');
      const persistedUser = await userDao.reload(user);
      expect(persistedUser?.emails.length).toEqual(2);
      expect(persistedUser?.getVerifiedUserEmail('tester@test.de')).toBeDefined();
    });

    it('set unverified email to verified', async () => {
      const user = await testData.createUser('tester', {
        emails: [new UserEmail('secondary@test.de', false)],
      });
      expect(user.getUnverifiedUserEmail('secondary@test.de')).toBeDefined();
      await userDao.setEmailVerification(user, 'secondary@test.de');
      expect(user.getVerifiedUserEmail('secondary@test.de')).toBeDefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser?.emails.length).toEqual(2);
      expect(persistedUser?.getVerifiedUserEmail('secondary@test.de')).toBeDefined();
    });

    it('set verified email to unverified', async () => {
      const user = await testData.createUser('tester', {
        emails: [new UserEmail('secondary@test.de', true)],
      });
      expect(user.getVerifiedUserEmail('secondary@test.de')).toBeDefined();
      await userDao.setEmailVerification(user, 'secondary@test.de', false);
      expect(user.getUnverifiedUserEmail('secondary@test.de')).toBeDefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser?.emails.length).toEqual(2);
      expect(persistedUser?.getUnverifiedUserEmail('secondary@test.de')).toBeDefined();
    });

    it('set verified case insensitive email to unverified', async () => {
      const user = await testData.createUser('tester', {
        emails: [new UserEmail('secondary@test.de', true)],
      });
      expect(user.getVerifiedUserEmail('secondary@test.de')).toBeDefined();
      await userDao.setEmailVerification(user, 'SECONDARY@test.de', false);
      expect(user.getUnverifiedUserEmail('SECONDARY@test.de')).toBeDefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser?.emails.length).toEqual(2);
      expect(persistedUser?.getUnverifiedUserEmail('SECONDARY@test.de')).toBeDefined();
    });

    it('set unknown email to verified does not alter user email', async () => {
      const user = await testData.createUser('tester');
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      await userDao.setEmailVerification(user, 'secondary@test.de', true);
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser?.getUserEmail('secondary@test.de')).toBeUndefined();
    });
  });

  describe('removeEmail()', () => {
    it('remove existing email', async () => {
      const user = await testData.createUser('tester', {
        emails: [new UserEmail('secondary@test.de')],
      });
      await userDao.removeEmail(user, 'secondary@test.de');
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser?.getUserEmail('secondary@test.de')).toBeUndefined();
    });

    it('remove non existing email', async () => {
      const user = await testData.createUser('tester');
      await userDao.removeEmail(user, 'secondary@test.de');
      expect(user.getUserEmail('secondary@test.de')).toBeUndefined();
      const persistedUser = await userDao.reload(user);
      expect(persistedUser?.getUserEmail('secondary@test.de')).toBeUndefined();
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
      expect(reloaded?.profilesCount.user).toEqual(1);
      expect(reloaded?.profilesCount.group).toEqual(0);
      expect(reloaded?.profilesCount.organization).toEqual(0);
    });

    it('increment group profile count', async () => {
      const user = await createTestUser();
      await userDao.incrementProfileCount(user, ProfileType.Group);
      expect(user.profilesCount.user).toEqual(0);
      expect(user.profilesCount.group).toEqual(1);
      expect(user.profilesCount.organization).toEqual(0);

      const reloaded = await userDao.reload(user);
      expect(reloaded?.profilesCount.user).toEqual(0);
      expect(reloaded?.profilesCount.group).toEqual(1);
      expect(reloaded?.profilesCount.organization).toEqual(0);
    });

    it('increment organization profile count', async () => {
      const user = await createTestUser();
      await userDao.incrementProfileCount(user, ProfileType.Organization);
      expect(user.profilesCount.user).toEqual(0);
      expect(user.profilesCount.group).toEqual(0);
      expect(user.profilesCount.organization).toEqual(1);

      const reloaded = await userDao.reload(user);
      expect(reloaded?.profilesCount.user).toEqual(0);
      expect(reloaded?.profilesCount.group).toEqual(0);
      expect(reloaded?.profilesCount.organization).toEqual(1);
    });

    it('assure count >= 0', async () => {
      const user = await createTestUser();
      await userDao.incrementProfileCount(user, ProfileType.User, -2);
      expect(user.profilesCount.user).toEqual(0);
      expect(user.profilesCount.group).toEqual(0);
      expect(user.profilesCount.organization).toEqual(0);

      const reloaded = await userDao.reload(user);
      expect(reloaded?.profilesCount.user).toEqual(0);
      expect(reloaded?.profilesCount.group).toEqual(0);
      expect(reloaded?.profilesCount.organization).toEqual(0);
    });
  });

  describe('createRefreshToken', () => {
    it('refresh token limit', async () => {
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
            expiration: addMinutes(new Date(), 1),
          }),
          new RefreshToken({
            vid: 'vid3',
            hash: 'someHash3',
            expiration: addMinutes(new Date(), 1),
          }),
          new RefreshToken({
            vid: 'vid4',
            hash: 'someHash4',
            expiration: addMinutes(new Date(), 1),
          }),
          new RefreshToken({
            vid: 'vid5',
            hash: 'someHash5',
            expiration: addMinutes(new Date(), 1),
          }),
          new RefreshToken({
            vid: 'vid6',
            hash: 'someHash6',
            expiration: addMinutes(new Date(), 1),
          }),
        ],
      });

      await userDao.updateRefreshToken(
        user,
        new RefreshToken({ vid: 'vid6', hash: 'someHash6', expiration: addMinutes(new Date(), 1) })
      );

      await userDao.updateRefreshToken(
        user,
        new RefreshToken({ vid: 'vid5', hash: 'someHash5', expiration: addMinutes(new Date(), 1) })
      );

      await userDao.updateRefreshToken(
        user,
        new RefreshToken({ vid: 'vid1', hash: 'someHash1', expiration: addMinutes(new Date(), 1) })
      );

      await userDao.updateRefreshToken(
        user,
        new RefreshToken({ vid: 'vid3', hash: 'someHash1', expiration: addMinutes(new Date(), 1) })
      );

      await userDao.updateRefreshToken(
        user,
        new RefreshToken({ vid: 'vid2', hash: 'someHash1', expiration: addMinutes(new Date(), 1) })
      );

      await userDao.createRefreshToken(
        user,
        new RefreshToken({ vid: 'vid7', hash: 'someHash7', expiration: addMinutes(new Date(), 1) }),
        6
      );

      const persistedUser = await userDao.reload(user);

      expect(persistedUser?.refreshTokens.length).toEqual(6);
      expect(persistedUser?.refreshTokens.find((token) => token.vid === 'vid1')).toBeDefined();
      expect(persistedUser?.refreshTokens.find((token) => token.vid === 'vid5')).toBeDefined();
      expect(persistedUser?.refreshTokens.find((token) => token.vid === 'vid6')).toBeDefined();
      expect(persistedUser?.refreshTokens.find((token) => token.vid === 'vid7')).toBeDefined();
      expect(persistedUser?.refreshTokens.find((token) => token.vid === 'vid3')).toBeDefined();
      expect(persistedUser?.refreshTokens.find((token) => token.vid === 'vid2')).toBeDefined();
      expect(persistedUser?.refreshTokens.find((token) => token.vid === 'vid4')).toBeUndefined();
    });
  });
});
