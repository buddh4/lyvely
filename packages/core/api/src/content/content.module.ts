import { Global, Inject, Injectable, Module, OnModuleInit, Scope, Type } from '@nestjs/common';
import { UsersModule } from '@/users';
import { Content, ContentSchema, ContentScore, ContentScoreSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentScoreService, ContentService } from './services';
import { ProfileScore, ProfilesModule } from '@/profiles';
import { ContentDao, ContentScoreDao } from './daos';
import {
  ContentCreatePolicy,
  ContentReadPolicy,
  ContentWritePolicy,
  ContentManagePolicy,
} from './policies';
import { ContentEventPublisher, ContentTypeRegistry } from './components';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { LiveModule } from '@/live';
import { uniqueId } from 'lodash';
import { ContentController } from './controllers';
import { LyvelyModule } from '@/core';
import { CONTENT_MODULE_ID, ContentStreamFeature } from '@lyvely/core-interface';

const ContentModel = MongooseModule.forFeature([
  {
    name: Content.name,
    schema: ContentSchema,
  },
]);

const ContentScoreActionModel = MongooseModule.forFeature([
  {
    name: ContentScore.name,
    collection: ProfileScore.collectionName(),
    schema: ContentScoreSchema,
  },
]);

@Global()
@LyvelyModule({
  id: CONTENT_MODULE_ID,
  name: 'Content',
  path: __dirname,
  features: [ContentStreamFeature],
  policies: [ContentCreatePolicy, ContentReadPolicy, ContentWritePolicy, ContentManagePolicy],
  imports: [UsersModule, ProfilesModule, ContentModel, ContentScoreActionModel, LiveModule],
  controllers: [ContentController],
  providers: [
    ContentService,
    ContentDao,
    ContentEventPublisher,
    ContentTypeRegistry,
    ContentReadPolicy,
    ContentWritePolicy,
    ContentScoreService,
    ContentScoreDao,
  ],
  exports: [
    ContentDao,
    ContentModel,
    ContentService,
    ContentScoreService,
    ContentTypeRegistry,
    ContentReadPolicy,
    ContentWritePolicy,
    ContentEventPublisher,
  ],
})
export class ContentCoreModule {}

@Module({})
export class ContentModule {
  static registerContentType(...contentTypes: Type<Content>[]): DynamicModule {
    return {
      module: ContentModule,
      providers: [
        {
          provide: `ContentTypeRegistration${uniqueId('ContentTypeRegistration')}`,
          useClass: registerContentTypeOnInit(contentTypes),
        },
      ],
    };
  }
}

function registerContentTypeOnInit(contentTypes: Type<Content>[]) {
  @Injectable({ scope: Scope.DEFAULT })
  class RegisterContentTypeService implements OnModuleInit {
    @Inject()
    private contentTypeRegistry: ContentTypeRegistry;

    onModuleInit(): any {
      if (contentTypes && contentTypes.length) {
        this.contentTypeRegistry.registerTypes(contentTypes.map((type) => ({ type })));
      }
    }
  }

  return RegisterContentTypeService;
}
