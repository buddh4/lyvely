import { ILyvelyTestingModule } from '@/testing';
import { Content, ContentMetadata, ContentSchema } from '../schemas';
import { TestContent, TestContentSchema, TestContentData, buildContentTest } from '../testing';
import { Model } from '@/core';
import { User } from '@/users';
import { Profile, ProfileTestDataUtils } from '@/profiles';
import { ContentService } from './content.service';

describe('content dao', () => {
  let testingModule: ILyvelyTestingModule;
  let contentService: ContentService;
  let testContentModel: Model<TestContent>;
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
    testingModule = await buildContentTest(TEST_KEY).models(ContentModel).compile();
    contentService = testingModule.get(ContentService);
    testContentModel = testingModule.get('TestContentModel');
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  async function createTestContent(user: User, profile: Profile, archived = false) {
    const testContent = new TestContent(
      { profile, user },
      {
        content: new TestContentData({ testData: 'test' }),
        meta: new ContentMetadata({ archived }),
      }
    );
    const entity = await testContentModel.create(testContent);
    return new TestContent({ profile, user }, entity.toObject());
  }

  it('should be defined', () => {
    expect(contentService).toBeDefined();
  });

  describe('archive', () => {
    it('archive content', async () => {
      const { owner, ownerContext, member, profile } = await testData.createSimpleGroup();
      const content = await createTestContent(member, profile);
      expect(content.meta.archived).toEqual(false);
      const updatedAt = content.meta.updatedAt;
      await contentService.archive(owner, content);
      expect(content.meta.archived).toEqual(true);
      const persisted = await contentService.findByContextAndId(ownerContext, content);
      expect(persisted?.meta.archived).toEqual(true);
      expect(persisted?.meta.updatedAt).not.toEqual(updatedAt);
      expect(persisted?.meta.updatedBy).toEqual(owner._id);
    });
  });

  describe('restore', () => {
    it('restore content', async () => {
      const { owner, ownerContext, member, profile } = await testData.createSimpleGroup();
      const content = await createTestContent(member, profile, true);
      expect(content.meta.archived).toEqual(true);
      const updatedAt = content.meta.updatedAt;
      await contentService.restore(owner, content);
      expect(content.meta.archived).toEqual(false);
      const persisted = await contentService.findByContextAndId(ownerContext, content);
      expect(persisted?.meta.archived).toEqual(false);
      expect(persisted?.meta.updatedAt).not.toEqual(updatedAt);
      expect(persisted?.meta.updatedBy).toEqual(owner._id);
    });
  });
});
