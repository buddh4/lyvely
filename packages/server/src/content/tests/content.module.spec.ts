import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule } from '@/test';
import { Content, ContentSchema } from '../schemas';
import {
  TestContent,
  TestContentB,
  TestContentBSchema,
  TestContentSchema,
} from './src/test-content.schema';
import { ContentCoreModule, ContentModule, ContentService, ContentTypeRegistry } from '@/content';
import { INestApplication, Module } from '@nestjs/common';

describe('content module', () => {
  let testingModule: TestingModule;
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
    testingModule = await createBasicTestingModule('content_module', [], TestModels, [
      ContentCoreModule,
      TestModule,
    ]).compile();
    contentService = testingModule.get<ContentService>(ContentService);
    contentTypeRegistry = testingModule.get<ContentTypeRegistry>(ContentTypeRegistry);
    app = testingModule.createNestApplication();
    await app.init();
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
