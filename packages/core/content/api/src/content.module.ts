import { Global, Inject, Injectable, Module, OnModuleInit, Scope, Type } from '@nestjs/common';
import { UsersModule } from '@lyvely/users';
import { Content, ContentSchema, ContentScore, ContentScoreSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentScoreService, ContentService, ContentStreamService } from './services';
import { ProfileScore, ProfilesModule } from '@lyvely/profiles';
import { ContentDao, ContentScoreDao } from './daos';
import { ContentCreatePolicy, ContentReadPolicy, ContentWritePolicy } from './policies';
import { ContentEventPublisher, ContentTypeRegistry } from './components';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { LiveModule } from '@lyvely/live';
import { uniqueId } from 'lodash';
import { ContentStreamController, ContentController } from './controllers';
import { LyvelyModule } from '@lyvely/core';
import { ContentManagePolicy } from './policies/content-manage.policy';

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
  id: 'content',
  name: 'Content',
  path: __dirname,
  policies: [ContentCreatePolicy, ContentReadPolicy, ContentWritePolicy, ContentManagePolicy],
  imports: [UsersModule, ProfilesModule, ContentModel, ContentScoreActionModel, LiveModule],
  controllers: [ContentController, ContentStreamController],
  providers: [
    ContentService,
    ContentStreamService,
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
