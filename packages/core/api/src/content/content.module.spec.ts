import { buildTest, LyvelyTestingModule } from '@/testing';
import { Content, ContentSchema } from './schemas';
import {
  buildContentTest,
  TestContent,
  TestContentB,
  TestContentBSchema,
  TestContentSchema,
} from './testing';
import { INestApplication, Module } from '@nestjs/common';
import { ContentModule } from './content.module';
import { ContentService } from './services';
import { ContentTypeRegistry } from './components';

describe('content module', () => {
  let testingModule: LyvelyTestingModule;
  let contentService: ContentService;
  let contentTypeRegistry: ContentTypeRegistry;
  let app: INestApplication;

  const TestModels = [
    {
      name: Content.name,
      collection: Content.collectionName(),
      schema: ContentSchema,
      discriminators: [{ name: TestContent.name, schema: TestContentSchema }],
    },
    {
      name: Content.name,
      collection: Content.collectionName(),
      schema: ContentSchema,
      discriminators: [{ name: TestContentB.name, schema: TestContentBSchema }],
    },
  ];

  @Module({
    imports: [ContentModule.registerContentType(TestContent, TestContentB)],
  })
  class TestModule {}

  beforeEach(async () => {
    testingModule = await buildContentTest('content_module')
      .imports([TestModule])
      .models(TestModels)
      .compile();
    contentService = testingModule.get<ContentService>(ContentService);
    contentTypeRegistry = testingModule.get<ContentTypeRegistry>(ContentTypeRegistry);
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(contentService).toBeDefined();
    expect(contentTypeRegistry).toBeDefined();
  });

  describe('auto content registration', () => {
    it('assure content types are registered', async () => {
      expect(contentTypeRegistry.getTypeDefinition(TestContent.name)).toBeDefined();
      expect(contentTypeRegistry.getTypeDefinition(TestContentB.name)).toBeDefined();
    });
  });
});
