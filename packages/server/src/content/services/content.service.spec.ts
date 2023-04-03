import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils, createContentTestingModule } from '@/test';
import { Content, ContentSchema } from '../schemas';
import { TestContent, TestContentDocument, TestContentSchema } from '../test/test-content.schema';
import { Model } from 'mongoose';
import { User } from '@/users';
import { Profile } from '@/profiles';
import { ContentService } from '@/content';

describe('content dao', () => {
  let testingModule: TestingModule;
  let contentService: ContentService;
  let testContentModel: Model<TestContentDocument>;
  let testData: TestDataUtils;

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
    testingModule = await createContentTestingModule(TEST_KEY, [], ContentModel).compile();
    contentService = testingModule.get(ContentService);
    testContentModel = testingModule.get<Model<TestContentDocument>>('TestContentModel');
    testData = testingModule.get(TestDataUtils);
  });

  async function createTestContent(user: User, profile: Profile, isArchived = false) {
    const testContent = new TestContent(profile, user, {
      content: { testData: 'test' },
      meta: { isArchived },
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
      expect(content.meta.isArchived).toEqual(false);
      const updatedAt = content.meta.updatedAt;
      await contentService.archive(owner, content);
      expect(content.meta.isArchived).toEqual(true);
      const persisted = await contentService.findContentByProfileAndId(profile, content);
      expect(persisted.meta.isArchived).toEqual(true);
      expect(persisted.meta.updatedAt).not.toEqual(updatedAt);
      expect(persisted.meta.updatedBy).toEqual(owner._id);
    });
  });

  describe('unarchive', () => {
    it('unarchive content', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const content = await createTestContent(member, profile, true);
      expect(content.meta.isArchived).toEqual(true);
      const updatedAt = content.meta.updatedAt;
      await contentService.unarchive(owner, content);
      expect(content.meta.isArchived).toEqual(false);
      const persisted = await contentService.findContentByProfileAndId(profile, content);
      expect(persisted.meta.isArchived).toEqual(false);
      expect(persisted.meta.updatedAt).not.toEqual(updatedAt);
      expect(persisted.meta.updatedBy).toEqual(owner._id);
    });
  });
});
