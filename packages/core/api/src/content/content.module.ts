import { Global, Inject, Injectable, Module, OnModuleInit, Scope, Type } from '@nestjs/common';
import { UsersModule } from '@/users';
import { Content, ContentSchema, ContentScore, ContentScoreSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContentScoreService,
  ContentService,
  ContentStreamService,
  ContentPolicyService,
} from './services';
import { ProfileScore, ProfilesModule } from '@/profiles';
import { ContentDao, ContentScoreDao } from './daos';
import {
  ContentCreatePolicy,
  ContentReadPolicy,
  ContentWritePolicy,
  ContentManagePolicy,
  ContentDeletePolicy,
  ContentAuthorPolicy,
} from './policies';
import { ContentEventPublisher, ContentTypeRegistry } from './components';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { LiveModule } from '@/live';
import { uniqueId } from '@lyvely/common';
import { ContentController, ContentStreamController } from './controllers';
import { LyvelyModule } from '@/core';
import { CONTENT_MODULE_ID, ContentStreamFeature } from '@lyvely/interface';
import { ContentPermissionsService } from '@/content/services/content-permissions.service';

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
  policies: [
    ContentCreatePolicy,
    ContentReadPolicy,
    ContentDeletePolicy,
    ContentWritePolicy,
    ContentManagePolicy,
    ContentAuthorPolicy,
  ],
  imports: [UsersModule, ProfilesModule, ContentModel, ContentScoreActionModel, LiveModule],
  controllers: [ContentController, ContentStreamController],
  providers: [
    ContentService,
    ContentPolicyService,
    ContentDao,
    ContentEventPublisher,
    ContentTypeRegistry,
    ContentReadPolicy,
    ContentWritePolicy,
    ContentScoreService,
    ContentScoreDao,
    ContentStreamService,
    ContentPermissionsService,
  ],
  exports: [
    ContentService,
    ContentPolicyService,
    ContentDao,
    ContentScoreService,
    ContentTypeRegistry,
    ContentEventPublisher,
    ContentPermissionsService,
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
