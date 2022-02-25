import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createTestingModule } from '../../test/utils/test.utils';
import { ContentDao } from '../daos/content.dao';
import { Content, ContentSchema } from '../schemas/content.schema';
import { TestContent, TestContentDocument, TestContentSchema } from './src/test-content.schema';
import { Model } from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import { Profile } from '../../profiles/schemas/profiles.schema';
import { ContentTypeRegistry } from '../components/content-type.registry';

describe('content dao', () => {
  let testingModule: TestingModule;
  let testDataUtils: TestDataUtils;
  let contentDao: ContentDao;
  let contentTypeRegistry: ContentTypeRegistry;
  let testContentModel: Model<TestContentDocument>;

  const TEST_KEY = 'content_dao';

  const ContentModel = [
    {
      name: Content.name,
      collection: Content.collectionName(),
      schema: ContentSchema,
      discriminators: [
        {name: TestContent.name, schema: TestContentSchema},
      ],
    }
  ];

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY, [], ContentModel).compile();
    contentDao = testingModule.get<ContentDao>(ContentDao);
    testDataUtils = testingModule.get<TestDataUtils>(TestDataUtils);
    contentTypeRegistry = testingModule.get<ContentTypeRegistry>(ContentTypeRegistry);
    testContentModel = testingModule.get<Model<TestContentDocument>>('TestContentModel');
  });

  afterEach(async () => {
    await testDataUtils.reset(TEST_KEY);
  });

  async function createTestContent(user: User, profile: Profile, testData = 'Testing...') {
    const testContent = new TestContent(user, profile, { data: { testData: testData }});
    return new TestContent((await testContentModel.create(testContent)).toObject());
  }

  describe('findById', () => {
    it('search unregistered content', async() => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = await createTestContent(user, profile, 'Hello World');
      const search = <TestContent> await contentDao.findById(content._id);
      expect(search instanceof Content).toEqual(true);
      expect(search instanceof TestContent).toEqual(false);
      expect(search.data.testData).toEqual('Hello World');
    });

    it('search registered content', async() => {
      const { user, profile } = await testDataUtils.createUserAndProfile();

      contentTypeRegistry.registerContentType({
        type: TestContent.name,
        name: 'Test Content',
        moduleId: 'test',
        constructor: TestContent,
        description: 'Just a content model to test things'
      });

      const content = await createTestContent(user, profile, 'Hello World');
      const search = <TestContent> await contentDao.findById(content._id);
      expect(search instanceof Content).toEqual(true);
      expect(search instanceof TestContent).toEqual(true);
      expect(search.data.testData).toEqual('Hello World');
    })
  });
});
