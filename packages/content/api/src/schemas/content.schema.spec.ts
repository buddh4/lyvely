import { TestingModule } from '@nestjs/testing';
import { TestDataUtils, createContentTestingModule } from '@lyvely/testing';
import { Profile } from '@lyvely/profiles';
import { User } from '@lyvely/users';
import { Content, ContentLog, ContentMetadata, CreatedAs } from '../schemas';
import { CreatedAsType } from '@lyvely/common';
import { expect } from '@jest/globals';
import { ContentDataType } from '@lyvely/content';

describe('Content Model', () => {
  let testingModule: TestingModule;
  let testDataUtils: TestDataUtils;
  let user: User;
  let profile: Profile;

  const TEST_KEY = 'content_model';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY).compile();
    testDataUtils = testingModule.get<TestDataUtils>(TestDataUtils);
    const userAndProfile = await testDataUtils.createUserAndProfile();
    user = userAndProfile.user;
    profile = userAndProfile.profile;
  });

  afterEach(async () => {
    await testDataUtils.reset(TEST_KEY);
  });

  describe('constructor', () => {
    it('content meta', async () => {
      const content = new Content(profile, user);
      expect(content.meta instanceof ContentMetadata).toEqual(true);
      expect(content.meta.createdBy).toEqual(user._id);
      expect(content.meta.createdAs).toBeDefined();
      expect(content.meta.createdAs.authorId).toEqual(user._id);
      expect(content.meta.createdAs.type).toEqual(CreatedAsType.User);
      expect(content.pid).toEqual(profile._id);
    });

    it('content meta overwrite createdAs', async () => {
      const content = new Content(profile, user, { meta: { createdAs: new CreatedAs(profile) } });
      expect(content.meta instanceof ContentMetadata).toEqual(true);
      expect(content.meta.createdAs).toBeDefined();
      expect(content.meta.createdAs.authorId).toEqual(profile._id);
      expect(content.meta.createdAs.type).toEqual(CreatedAsType.Profile);
    });

    it('constructor with user, profile and data object', async () => {
      const content = new Content(profile, user, { content: { title: 'test title' } });
      expect(content.meta.createdBy).toEqual(user._id);
      expect(content.content instanceof ContentDataType);
      expect(content.content.title).toEqual('test title');
      expect(content.meta.createdAs).toBeDefined();
      expect(content.meta.createdAs.authorId).toEqual(user._id);
      expect(content.meta.createdAs.type).toEqual(CreatedAsType.User);
    });

    it('constructor with logs', async () => {
      const content = new Content(profile, user, { logs: [{ type: 'test' }] });
      expect(content.logs).toBeTruthy();
      expect(content.logs.length).toEqual(1);
      expect(content.logs[0] instanceof ContentLog).toEqual(true);
    });
  });
});
