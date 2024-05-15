import { LyvelyTestingModule } from '@/testing';
import { Profile, ProfileTestDataUtils } from '@/profiles';
import { User } from '@/users';
import { Content, ContentLog, ContentMetadata, CreatedAs, ContentDataType } from '../schemas';
import { CreatedAsType } from '@lyvely/interface';
import { buildContentTest } from '@/content';

describe('Content Model', () => {
  let testingModule: LyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let user: User;
  let profile: Profile;

  const TEST_KEY = 'content_model';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY).compile();
    testDataUtils = testingModule.get(ProfileTestDataUtils);
    const userAndProfile = await testDataUtils.createUserAndProfile();
    user = userAndProfile.user;
    profile = userAndProfile.profile;
  });

  describe('constructor', () => {
    it('content meta', async () => {
      const content = new Content({ profile, user });
      expect(content.meta instanceof ContentMetadata).toEqual(true);
      expect(content.meta.createdBy).toEqual(user._id);
      expect(content.meta.createdAs).toBeDefined();
      expect(content.meta.createdAs?.authorId).toEqual(user._id);
      expect(content.meta.createdAs?.type).toEqual(CreatedAsType.User);
      expect(content.pid).toEqual(profile._id);
    });

    it('content meta overwrite createdAs', async () => {
      const content = new Content(
        { profile, user },
        {
          meta: new ContentMetadata({ createdAs: new CreatedAs(profile) }),
        },
      );
      expect(content.meta instanceof ContentMetadata).toEqual(true);
      expect(content.meta.createdAs).toBeDefined();
      expect(content.meta.createdAs?.authorId).toEqual(profile._id);
      expect(content.meta.createdAs?.type).toEqual(CreatedAsType.Profile);
    });

    it('constructor with user, profile and data object', async () => {
      const content = new Content(
        { profile, user },
        {
          content: new ContentDataType({ title: 'test title' }),
        },
      );
      expect(content.meta.createdBy).toEqual(user._id);
      expect(content.content instanceof ContentDataType);
      expect(content.content.title).toEqual('test title');
      expect(content.meta.createdAs).toBeDefined();
      expect(content.meta.createdAs?.authorId).toEqual(user._id);
      expect(content.meta.createdAs?.type).toEqual(CreatedAsType.User);
    });

    it('constructor with logs', async () => {
      const content = new Content({ profile, user }, { logs: [new ContentLog({ type: 'test' })] });
      expect(content.logs).toBeTruthy();
      expect(content.logs.length).toEqual(1);
      expect(content.logs[0] instanceof ContentLog).toEqual(true);
    });
  });
});
