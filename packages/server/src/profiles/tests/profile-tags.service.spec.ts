import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule, getObjectId } from '../../test/utils/test.utils';
import { Tag } from "../../tags";
import { ProfileTagsService, ProfilesService } from "../services";

describe('ProfileService', () => {
  let testingModule: TestingModule;
  let profileTagsService: ProfileTagsService;
  let profileService: ProfilesService;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_service';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY).compile();
    profileTagsService = testingModule.get<ProfileTagsService>(ProfileTagsService);
    profileService = testingModule.get<ProfilesService>(ProfilesService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(profileTagsService).toBeDefined();
  });

  describe('archiveTag', () => {
    it('archive tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['health']);
      let tag = profile.getTagByName('health');
      expect(await profileTagsService.archiveTag(profile, tag)).toEqual(true);
      expect(tag.archived).toEqual(true);
      const reload = await profileService.findProfileById(profile);
      tag = profile.getTagByName('health');
      expect(tag.archived).toEqual(true);
    });
  });

  describe('unarchiveTag', () => {
    it('archive tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['health']);
      let tag = profile.getTagByName('health');
      expect(await profileTagsService.archiveTag(profile, tag)).toEqual(true);
      expect(tag.archived).toEqual(true);
      expect(await profileTagsService.unArchiveTag(profile, tag)).toEqual(true);
      expect(tag.archived).toEqual(false);
      const reload = await profileService.findProfileById(profile);
      tag = profile.getTagByName('health');
      expect(tag.archived).toEqual(false);
    });
  });

  describe('updateTag', () => {
    it('update existing tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      await profileTagsService.mergeTags(profile, ['health']);
      const tag = profile.getTagByName('health');
      const result = await profileTagsService.updateTag(profile, tag, { name: 'healthy' });
      expect(result).toEqual(true);
      expect(tag.name).toEqual('healthy');
      expect(profile.getTagByName('healthy')).toBeDefined();
       const reloaded = await profileService.findProfileById(profile);
       expect(reloaded.getTagByName('healthy').name).toBeDefined()
    });

    it('update non existing tag', async () => {
      const { profile } = await testData.createUserAndProfile();
      const tag = new Tag({ _id: getObjectId('testtag'), name: 'Test' });
      const result = await profileTagsService.updateTag(profile, tag, { name: 'healthy' });
      expect(result).toEqual(false);
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
      await profileTagsService.mergeTags(profile, [
        'health',
        'social',
        'health',
      ]);
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
