import { UserProfile, Tag, Profile } from '../schemas';
import { ProfileDao } from './index';
import { ProfileTestDataUtils, profilesTestPlugin } from '../testing';
import { buildTest, LyvelyTestingModule } from '@lyvely/testing';

describe('ProfileDao', () => {
  let testingModule: LyvelyTestingModule;
  let profileDao: ProfileDao;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile_dao';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([profilesTestPlugin]).compile();
    profileDao = testingModule.get<ProfileDao>(ProfileDao);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(profileDao).toBeDefined();
  });

  describe('findById()', () => {
    it('find profile by ObjectId', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new UserProfile(user, { name: 'test' }));
      const search = await profileDao.findById(profile._id);
      expect(search).toBeDefined();
      expect(profile._id.toString()).toEqual(search?._id.toString());
    });

    it('find profile by string id', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new UserProfile(user, { name: 'test' }));
      const search = await profileDao.findById(profile._id);
      expect(search).toBeDefined();
      expect(profile._id.toString()).toEqual(search?._id.toString());
    });
  });

  describe('update()', () => {
    it('save profile with updated name', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new UserProfile(user, { name: 'test' }));
      profile.name = 'overwritten';
      await profileDao.updateOneSetById(profile, { name: 'overwritten' });
      const updated = await profileDao.reload(profile);
      expect(updated?.name).toEqual('overwritten');
    });

    it('update the score of a profile', async () => {
      const user = await testData.createUser();
      let profile: Profile | null = await profileDao.save(new UserProfile(user, { name: 'test' }));
      await profileDao.updateOneSetById(profile, { score: 10 });
      profile = await profileDao.reload(profile);
      expect(profile?.score).toEqual(10);
    });
  });

  describe('addTag()', () => {
    it('add single tags', async () => {
      const user = await testData.createUser();
      const profile = await profileDao.save(new UserProfile(user, { name: 'test' }));
      await profileDao.addTags(profile, [Tag.create({ name: 'Test1' })]);
      const update = await profileDao.reload(profile);
      expect(profile.tags.length).toEqual(1);
      expect(update!.tags.length).toEqual(1);
      expect(profile!.tags![0].name).toEqual('Test1');
      expect(update!.tags![0].name).toEqual('Test1');
      expect(profile!.tags![0].isNew).toEqual(true);
      expect(update!.tags![0].isNew).toEqual(false);
    });
  });
});