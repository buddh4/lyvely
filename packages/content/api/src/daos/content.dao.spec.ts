import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { ContentDao } from './index';
import { Content, ContentSchema } from '../schemas';
import { TestContent, TestContentDocument, TestContentSchema } from '../testing';
import { Model } from 'mongoose';
import { User } from '@lyvely/users';
import { Profile, ProfileTestDataUtils } from '@lyvely/profiles';
import { ContentTypeRegistry } from '../components';

describe('content dao', () => {
  let testingModule: LyvelyTestingModule;
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
    testingModule = await buildTest(TEST_KEY)
      .providers([ContentDao, ContentTypeRegistry])
      .models(ContentModel)
      .compile();
    contentDao = testingModule.get<ContentDao>(ContentDao);
    contentTypeRegistry = testingModule.get<ContentTypeRegistry>(ContentTypeRegistry);
    testContentModel = testingModule.get<Model<TestContentDocument>>('TestContentModel');
  });

  afterEach(() => {
    testingModule.afterEach();
  });

  async function createTestContent(user: User, profile: Profile, testData = 'Testing...') {
    const testContent = new TestContent(profile, user, { content: { testData: testData } });
    const entity = await testContentModel.create(testContent);
    return new TestContent(profile, user, entity.toObject());
  }

  describe('findById', () => {
    it('search unregistered content', async () => {
      const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
      const content = await createTestContent(user, profile, 'Hello World');
      const search = <TestContent>await contentDao.findById(content._id);
      expect(search instanceof Content).toEqual(true);
      expect(search instanceof TestContent).toEqual(false);
      expect(search.content.testData).toEqual('Hello World');
    });

    it('search registered content', async () => {
      const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();

      contentTypeRegistry.registerType(TestContent);

      const content = await createTestContent(user, profile, 'Hello World');
      const search = <TestContent>await contentDao.findById(content._id);
      expect(search instanceof Content).toEqual(true);
      expect(search instanceof TestContent).toEqual(true);
      expect(search.content.testData).toEqual('Hello World');
    });
  });
});
