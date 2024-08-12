import { ILyvelyTestingModule } from '@/testing';
import { ContentDao } from './index';
import { Content, ContentSchema, ContentMetadata } from '../schemas';
import { buildContentTest, TestContent, TestContentData, TestContentSchema } from '../testing';
import { Model } from '@/core';
import { User } from '@/users';
import { Profile, ProfileTestDataUtils } from '@/profiles';
import { ContentTypeRegistry } from '../components';

describe('content dao', () => {
  let testingModule: ILyvelyTestingModule;
  let contentDao: ContentDao;
  let contentTypeRegistry: ContentTypeRegistry;
  let testContentModel: Model<TestContent>;

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
    testingModule = await buildContentTest(TEST_KEY)
      .providers([ContentDao, ContentTypeRegistry])
      .models(ContentModel)
      .compile();
    contentDao = testingModule.get<ContentDao>(ContentDao);
    contentTypeRegistry = testingModule.get<ContentTypeRegistry>(ContentTypeRegistry);
    testContentModel = testingModule.get('TestContentModel');
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  async function createTestContent(user: User, profile: Profile, testData = 'Testing...', initData: Partial<TestContent> = {}) {
    const testContent = new TestContent(
      { profile, user },
      { ...{content: new TestContentData({ testData: testData }) },
          ...initData
      }
    );
    const entity = await testContentModel.create(testContent);
    return new TestContent({ profile, user }, entity.toObject());
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

  describe('search', () => {
    describe('archived', () => {
      it('ignore archived flag', async () => {
        const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
        const archivedContent = await createTestContent(user, profile, 'A', { meta: new ContentMetadata({ archived: true }) });
        const nonArchivedContent = await createTestContent(user, profile, 'B');
        const search = await contentDao.search(profile, {});
        expect(search.length).toEqual(2);
      });

      it('search archived content', async () => {
        const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
        const archivedContent = await createTestContent(user, profile, 'A', { meta: new ContentMetadata({ archived: true }) });
        const nonArchivedContent = await createTestContent(user, profile, 'B');
        const search = await contentDao.search(profile, { archived: true });
        expect(search.length).toEqual(1);
        expect(search[0]._id).toEqual(archivedContent._id);
      });

      it('search non archived content', async () => {
        const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
        const archivedContent = await createTestContent(user, profile, 'A', { meta: new ContentMetadata({ archived: true }) });
        const nonArchivedContent = await createTestContent(user, profile, 'B');
        const search = await contentDao.search(profile, { archived: false });
        expect(search.length).toEqual(1);
        expect(search[0]._id).toEqual(nonArchivedContent._id);
      });
    })
  });
});
