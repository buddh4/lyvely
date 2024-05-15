import { getObjectId, ILyvelyTestingModule } from '@/testing';
import { Tag } from '../schemas';
import { ProfileTagsService, ProfilesService } from './index';
import { buildProfileTest, ProfileTestDataUtils } from '../testing';
import { DocumentNotFoundException } from '@lyvely/interface';

describe('ProfileTagsService', () => {
  let testingModule: ILyvelyTestingModule;
  let profileTagsService: ProfileTagsService;
  let profileService: ProfilesService;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).compile();
    profileTagsService = testingModule.get<ProfileTagsService>(ProfileTagsService);
    profileService = testingModule.get<ProfilesService>(ProfilesService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(profileTagsService).toBeDefined();
  });

  describe('archiveTag', () => {
    it('archive tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['health']);
      let tag = profile.getTagByName('health')!;
      expect(await profileTagsService.archiveTag(profile, tag!)).toEqual(true);
      expect(tag.archived).toEqual(true);
      tag = profile.getTagByName('health')!;
      expect(tag.archived).toEqual(true);
    });
  });

  describe('restoreTag', () => {
    it('archive tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['health']);
      let tag = profile.getTagByName('health')!;
      expect(await profileTagsService.archiveTag(profile, tag!)).toEqual(true);
      expect(tag!.archived).toEqual(true);
      expect(await profileTagsService.restore(profile, tag!)).toEqual(true);
      expect(tag!.archived).toEqual(false);
      tag = profile.getTagByName('health')!;
      expect(tag!.archived).toEqual(false);
    });
  });

  describe('updateTag', () => {
    it('update existing tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['health']);
      const tag = profile.getTagByName('health')!;
      const result = await profileTagsService.updateTag(profile, tag, { name: 'healthy' });
      expect(result).toEqual(true);
      expect(tag.name).toEqual('healthy');
      expect(profile.getTagByName('healthy')).toBeDefined();
      const reloaded = await profileService.findProfileById(profile);
      expect(reloaded?.getTagByName('healthy')?.name).toBeDefined();
    });

    it('update non existing tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      const tag = new Tag({ _id: getObjectId('testtag'), name: 'Test' });

      expect.assertions(1);
      await profileTagsService.updateTag(profile, tag, { name: 'healthy' }).catch((e) => {
        expect(e instanceof DocumentNotFoundException).toEqual(true);
      });
    });
  });

  describe('mergeTags', () => {
    it('create from empty', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['health', 'social']);
      expect(profile.tags.length).toEqual(2);
      expect(profile.tags[0].name).toEqual('health');
      expect(profile.tags[1].name).toEqual('social');
    });

    it('add to existing set', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['social']);
      await profileTagsService.mergeTags(profile, ['health']);
      expect(profile.tags.length).toEqual(2);
      expect(profile.tags[0].name).toEqual('social');
      expect(profile.tags[1].name).toEqual('health');
    });

    it('add duplicate set', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['social']);
      await profileTagsService.mergeTags(profile, ['health', 'social', 'health']);
      expect(profile.tags.length).toEqual(2);
      expect(profile.tags[0].name).toEqual('social');
      expect(profile.tags[1].name).toEqual('health');
    });

    it('add empty set to existing', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['social']);
      await profileTagsService.mergeTags(profile, []);
      expect(profile.tags.length).toEqual(1);
      expect(profile.tags[0].name).toEqual('social');
    });

    it('add empty set to empty', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, []);
      expect(profile.tags.length).toEqual(0);
    });

    it('do not accept empty tags name string', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['']);
      expect(profile.tags.length).toEqual(0);
    });
  });
});
