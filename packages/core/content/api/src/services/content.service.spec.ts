import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { Content, ContentSchema } from '../schemas';
import { TestContent, TestContentDocument, TestContentSchema, contentTestPlugin } from '../testing';
import { Model } from 'mongoose';
import { User } from '@lyvely/users';
import { Profile, profilesTestPlugin, ProfileTestDataUtils } from '@lyvely/profiles';
import { ContentService } from './content.service';

describe('content dao', () => {
  let testingModule: LyvelyTestingModule;
  let contentService: ContentService;
  let testContentModel: Model<TestContentDocument>;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'content_service';

  const ContentModel = [
    {
      name: Content.name,
      collection: Content.collectionName(),
      schema: ContentSchema,
      discriminators: [{ name: TestContent.name, schema: TestContentSchema }],
    },
  ];

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([contentTestPlugin, profilesTestPlugin])
      .models(ContentModel)
      .compile();
    contentService = testingModule.get(ContentService);
    testContentModel = testingModule.get<Model<TestContentDocument>>('TestContentModel');
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  async function createTestContent(user: User, profile: Profile, archived = false) {
    const testContent = new TestContent(profile, user, {
      content: { testData: 'test' },
      meta: { archived },
    });
    const entity = await testContentModel.create(testContent);
    return new TestContent(profile, user, entity.toObject());
  }

  it('should be defined', () => {
    expect(contentService).toBeDefined();
  });

  describe('archive', () => {
    it('archive content', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const content = await createTestContent(member, profile);
      expect(content.meta.archived).toEqual(false);
      const updatedAt = content.meta.updatedAt;
      await contentService.archive(owner, content);
      expect(content.meta.archived).toEqual(true);
      const persisted = await contentService.findContentByProfileAndId(profile, content);
      expect(persisted?.meta.archived).toEqual(true);
      expect(persisted?.meta.updatedAt).not.toEqual(updatedAt);
      expect(persisted?.meta.updatedBy).toEqual(owner._id);
    });
  });

  describe('unarchive', () => {
    it('unarchive content', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const content = await createTestContent(member, profile, true);
      expect(content.meta.archived).toEqual(true);
      const updatedAt = content.meta.updatedAt;
      await contentService.unarchive(owner, content);
      expect(content.meta.archived).toEqual(false);
      const persisted = await contentService.findContentByProfileAndId(profile, content);
      expect(persisted?.meta.archived).toEqual(false);
      expect(persisted?.meta.updatedAt).not.toEqual(updatedAt);
      expect(persisted?.meta.updatedBy).toEqual(owner._id);
    });
  });
});
