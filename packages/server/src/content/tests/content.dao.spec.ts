import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils, createBasicTestingModule } from '@/test';
import { ContentDao } from '../daos';
import { Content, ContentSchema } from '../schemas';
import { TestContent, TestContentDocument, TestContentSchema } from './src/test-content.schema';
import { Model } from 'mongoose';
import { User } from '@/users';
import { Profile } from '@/profiles';
import { ContentTypeRegistry } from '@/content';

describe('content dao', () => {
  let testingModule: TestingModule;
  let contentDao: ContentDao;
  let contentTypeRegistry: ContentTypeRegistry;
  let testContentModel: Model<TestContentDocument>;

  const TEST_KEY = 'content_dao';

  const ContentModel = [
    {
      name: Content.name,
      collection: Content.collectionName(),
      schema: ContentSchema,
      discriminators: [{ name: TestContent.name, schema: TestContentSchema }],
    },
  ];

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(
      TEST_KEY,
      [ContentDao, ContentTypeRegistry],
      ContentModel,
    ).compile();
    contentDao = testingModule.get<ContentDao>(ContentDao);
    contentTypeRegistry = testingModule.get<ContentTypeRegistry>(ContentTypeRegistry);
    testContentModel = testingModule.get<Model<TestContentDocument>>('TestContentModel');
  });

  async function createTestContent(user: User, profile: Profile, testData = 'Testing...') {
    const testContent = new TestContent(profile, user, { content: { testData: testData } });
    const entity = await testContentModel.create(testContent);
    return new TestContent(profile, user, entity.toObject());
  }

  describe('findById', () => {
    it('search unregistered content', async () => {
      const { user, profile } = TestDataUtils.createDummyUserAndProfile();
      const content = await createTestContent(user, profile, 'Hello World');
      const search = <TestContent>await contentDao.findById(content._id);
      expect(search instanceof Content).toEqual(true);
      expect(search instanceof TestContent).toEqual(false);
      expect(search.content.testData).toEqual('Hello World');
    });

    it('search registered content', async () => {
      const { user, profile } = TestDataUtils.createDummyUserAndProfile();

      contentTypeRegistry.registerType(TestContent);

      const content = await createTestContent(user, profile, 'Hello World');
      const search = <TestContent>await contentDao.findById(content._id);
      expect(search instanceof Content).toEqual(true);
      expect(search instanceof TestContent).toEqual(true);
      expect(search.content.testData).toEqual('Hello World');
    });
  });
});
