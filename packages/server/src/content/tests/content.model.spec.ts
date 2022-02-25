import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createTestingModule } from '../../test/utils/test.utils';
import { Profile } from '../../profiles/schemas/profiles.schema';
import { User } from '../../users/schemas/users.schema';
import { Content } from '../schemas/content.schema';
import { expect } from '@jest/globals';
import { CreatedAs, CreatedAsType } from '../schemas/content-author-info.schema';
import { ContentMetadata } from '../schemas/content.metadata.schema';
import { ContentLog } from '../schemas/content.log.schema';

describe('Content Model', () => {
  let testingModule: TestingModule;
  let testDataUtils: TestDataUtils;
  let user: User;
  let profile: Profile;

  const TEST_KEY = 'content_model';

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY).compile();
    testDataUtils = testingModule.get<TestDataUtils>(TestDataUtils);
    const userAndProfile = await testDataUtils.createUserAndProfile();
    user = userAndProfile.user;
    profile = userAndProfile.profile;
  });

  afterEach(async () => {
    await testDataUtils.reset(TEST_KEY);
  });

  describe('constructor', () => {
    it('constructor with data object', async() => {
      const content = new Content({ pid: profile._id, createdBy: user._id });
      expect(content.pid).toEqual(profile._id);
      expect(content.createdBy).toEqual(user._id);
      expect(content.createdAs).not.toBeDefined();
    });

    it('constructor with user object only', async() => {
      const content = new Content(user);
      expect(content.createdBy).toEqual(user._id);
      expect(content.createdAs).toBeDefined();
      expect(content.createdAs.authorId).toEqual(user._id);
      expect(content.createdAs.name).toEqual(user.getDisplayName());
      expect(content.createdAs.type).toEqual(CreatedAsType.User);
      expect(content.createdAs.imageHash).toEqual(user.getImageHash());
    });

    it('constructor with user, profile ', async() => {
      const content = new Content(user, profile);
      expect(content.createdBy).toEqual(user._id);
      expect(content.createdAs).toBeDefined();
      expect(content.createdAs.authorId).toEqual(user._id);
      expect(content.createdAs.name).toEqual(user.getDisplayName());
      expect(content.createdAs.type).toEqual(CreatedAsType.User);
      expect(content.createdAs.imageHash).toEqual(user.getImageHash());
      expect(content.pid).toEqual(profile._id);
    });

    it('constructor with user, profile and data object', async() => {
      const content = new Content(user, profile, { title: 'test title' });
      expect(content.createdBy).toEqual(user._id);
      expect(content.title).toEqual('test title');
      expect(content.createdAs).toBeDefined();
      expect(content.createdAs.authorId).toEqual(user._id);
      expect(content.createdAs.name).toEqual(user.getDisplayName());
      expect(content.createdAs.type).toEqual(CreatedAsType.User);
      expect(content.createdAs.imageHash).toEqual(user.getImageHash());
    });

    it('constructor with metadata', async() => {
      const content = new Content({ metaData: { isArchivable: false } });
      expect(content.metaData).not.toBeNull();
      expect(content.metaData.isArchivable).toEqual(false);
      expect(content.metaData instanceof ContentMetadata).toEqual(true);
    });

    it('constructor with logs', async() => {
      const content = new Content({ logs: [{kind: 'test'}] });
      expect(content.logs).toBeTruthy();
      expect(content.logs.length).toEqual(1);
      expect(content.logs[0] instanceof ContentLog).toEqual(true);
    });

    it('constructor with createdAs', async() => {
      const content = new Content({ createdAs: {name: 'test'} });
      expect(content.createdAs).toBeTruthy();
      expect(content.createdAs instanceof CreatedAs).toEqual(true);
      expect(content.createdAs.name).toEqual('test');
    });
  });
});
