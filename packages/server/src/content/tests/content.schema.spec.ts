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
import { instanceToPlain } from 'class-transformer';
import { ContentModel } from '@lyvely/common';

describe('content dao', () => {
  let testingModule: TestingModule;
  let contentDao: ContentDao;
  let contentTypeRegistry: ContentTypeRegistry;
  let testContentModel: Model<TestContentDocument>;

  const TEST_KEY = 'content_dao';

  const ContentModels = [
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
      ContentModels,
    ).compile();
    contentDao = testingModule.get<ContentDao>(ContentDao);
    contentTypeRegistry = testingModule.get<ContentTypeRegistry>(ContentTypeRegistry);
    testContentModel = testingModule.get<Model<TestContentDocument>>('TestContentModel');
  });
});
