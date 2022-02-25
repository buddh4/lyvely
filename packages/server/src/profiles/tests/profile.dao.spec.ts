import { expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { DEFAULT_PROFILE_NAME, Profile, ProfileSchema } from '../schemas';
import { ProfileType } from 'lyvely-common';
import { ProfileDao } from '../daos';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { UsersModule } from '../../users/users.module';
import { TestModule } from '../../test/test.module';

describe('ProfileDao', () => {
  let testingModule: TestingModule;
  let profileDao: ProfileDao;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_dao';

  const ProfileModel = MongooseModule.forFeature([
    { name: Profile.name, schema: ProfileSchema },
  ]);

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TestDataUtils.getMongooseTestModule(TEST_KEY),
        ProfileModel,
        TestModule,
        UsersModule
      ],
      providers: [ProfileDao],
    }).compile();

    profileDao = testingModule.get<ProfileDao>(ProfileDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(profileDao).toBeDefined();
  });

  describe('insert()', () => {
    it('create default profile', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.upsert({createdBy: user._id});
      expect(profile).toBeDefined();
      expect(profile._id).toBeDefined();
      expect(profile.name).toEqual(DEFAULT_PROFILE_NAME);
      expect(profile.type).toEqual(ProfileType.User);
      expect(profile.categories).toBeDefined();
      expect(profile.categories.length).toEqual(0);
      expect(profile.score).toEqual(0);
      expect(profile.createdAt).toBeDefined();
      expect(profile.updatedAt).toBeDefined();
      expect(profile.createdAt).toEqual(profile.updatedAt);
    });

    it('create named profile', async () => {
      const user = await testData.createUser();
      const profile =  await profileDao.upsert({createdBy: user._id, name: 'superProfile'})
      expect(profile).toBeDefined();
      expect(profile.name).toEqual('superProfile');
    });

    it('assure profile name uniqueness per owner', async () => {
      const user = await testData.createUser();
      const profile1 = await profileDao.upsert({createdBy: user._id, name: 'superProfile'});
      const profile2 = await profileDao.upsert({createdBy: user._id, name: 'superProfile'});
      expect(profile1._id.toString()).toEqual(profile2._id.toString());
    });

    it('assure profile names do not need to be unique between users', async () => {
      const user = await testData.createUser();
      const user2 = await testData.createUser('user2');
      const profile1 = await profileDao.upsert({createdBy: user._id, name: 'superProfile'});
      const profile2 = await profileDao.upsert({createdBy: user2._id, name: 'superProfile'});
      expect(profile1._id.toString()).not.toEqual(profile2._id.toString());
    });
  });

  describe('findById()', () => {
    it('find profile by ObjectId', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.upsert({createdBy: user._id});
      const search = await profileDao.findById(profile._id);
      expect(search).toBeDefined();
      expect(profile._id.toString()).toEqual(search._id.toString());
    });

    it('find profile by string id', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.upsert({createdBy: user._id});
      const search = await profileDao.findById(profile._id);
      expect(search).toBeDefined();
      expect(profile._id.toString()).toEqual(search._id.toString());
    });
  });

  describe('update()', () => {
    it('save profile with updated name', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.upsert({createdBy: user._id});
      profile.name = 'overwritten';
      await profileDao.updateOneSet(profile, {name: 'overwritten'});
      const updated = await profileDao.reload(profile);
      expect(updated.name).toEqual('overwritten');
    });
  });

  describe('update()', () => {
    it('update the score of a profile', async () => {
      const user = await testData.createUser();
      let profile = await profileDao.upsert({createdBy: user._id});
      await profileDao.updateOneSet(profile, {score: 10});
      profile = await profileDao.reload(profile);
      expect(profile.score).toEqual(10);
    });
  });
});
