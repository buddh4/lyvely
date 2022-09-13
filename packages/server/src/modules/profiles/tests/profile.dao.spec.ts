import { expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Profile,
  ProfileSchema,
  UserProfileSchema,
  GroupProfileSchema,
  OrganizationSchema
} from '../schemas';
import { ProfileType } from '@lyvely/common';
import { ProfileDao } from '../daos';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { UsersModule } from '../../users';
import { TestModule } from '../../test/test.module';
import { Tag } from '../../tags';

describe('ProfileDao', () => {
  let testingModule: TestingModule;
  let profileDao: ProfileDao;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_dao';

  const ProfileModel = MongooseModule.forFeature([
    {
      name: Profile.name,
      schema: ProfileSchema,
      discriminators: [
        { name: ProfileType.User, schema: UserProfileSchema },
        { name: ProfileType.Group, schema: GroupProfileSchema },
        { name: ProfileType.Organization, schema: OrganizationSchema },
      ]
    },
  ]);

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TestDataUtils.getMongooseTestModule(TEST_KEY),
        TestDataUtils.getEventEmitterModule(),
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

  describe('findById()', () => {
    it('find profile by ObjectId', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new Profile(user, { name: 'test' }));
      const search = await profileDao.findById(profile._id);
      expect(search).toBeDefined();
      expect(profile._id.toString()).toEqual(search._id.toString());
    });

    it('find profile by string id', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new Profile(user, { name: 'test' }));
      const search = await profileDao.findById(profile._id);
      expect(search).toBeDefined();
      expect(profile._id.toString()).toEqual(search._id.toString());
    });
  });

  describe('update()', () => {
    it('save profile with updated name', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new Profile(user, { name: 'test' }));
      profile.name = 'overwritten';
      await profileDao.updateOneSetById(profile, { name: 'overwritten' });
      const updated = await profileDao.reload(profile);
      expect(updated.name).toEqual('overwritten');
    });

    it('update the score of a profile', async () => {
      const user = await testData.createUser();
      let profile = await profileDao.save(new Profile(user, { name: 'test' }));
      await profileDao.updateOneSetById(profile, { score: 10 });
      profile = await profileDao.reload(profile);
      expect(profile.score).toEqual(10);
    });
  });

  describe('addCategories()', () => {
    it('add single tags', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new Profile(user, { name: 'test' }));
      await profileDao.addTags(profile, [Tag.create({ name: 'Test1' })]);
      const update = await profileDao.reload(profile);
      expect(profile.tags.length).toEqual(1);
      expect(update.tags.length).toEqual(1);
      expect(profile.tags[0].name).toEqual('Test1');
      expect(update.tags[0].name).toEqual('Test1');
      expect(profile.tags[0].isNew).toEqual(true);
      expect(update.tags[0].isNew).toEqual(false);
    });
  });

});
