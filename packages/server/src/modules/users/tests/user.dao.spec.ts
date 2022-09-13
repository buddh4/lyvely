import { expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { UserDao } from '../daos';
import { User, UserDocument, UserSchema } from '../schemas';
import { Model } from 'mongoose';
import { ProfileType, UserStatus } from "@lyvely/common";

describe('UserDao', () => {
  let testingModule: TestingModule;
  let userDao: UserDao;
  let userModel: Model<UserDocument>;

  const TEST_KEY = 'user_dao';

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TestDataUtils.getMongooseTestModule(TEST_KEY),
        TestDataUtils.getEventEmitterModule(),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [UserDao],
    }).compile();

    userDao = testingModule.get<UserDao>(UserDao);
    userModel = testingModule.get<Model<UserDocument>>('UserModel');
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(userDao).toBeDefined();
  });

  async function createTestUser() {
    return await userDao.save(new User({
      username: 'Test',
      email: 'test@test.de',
      status: UserStatus.Active,
      locale: 'de',
      password: 'testPasswort'
    }));
  }

  describe('insert()', () => {
    it('create user', async () => {
      const user = await createTestUser();
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
    });

    it('can not create user without password', async () => {
      try {
        await userDao.save(new User({
          username: 'Test',
          email: 'test@test.de',
          status: UserStatus.Active,
          locale: 'de'
        }));
        expect(true).toEqual(false);
      } catch (e) {
        expect(e.errors).toBeDefined();
        expect(e.errors.password).toBeDefined();
        expect(e.errors.password.kind).toEqual('required');
      }
    });
  });

  describe('incrementProfileCount()', () => {
    it('increment user profile count', async () => {
      const user = await createTestUser()
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
      const user = await createTestUser()
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
      const user = await createTestUser()
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
      const user = await createTestUser()
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
});
