import { Inject, Injectable, Module, OnModuleInit, Type } from '@nestjs/common';
import { UsersModule } from '../users';
import { Content, ContentSchema, ContentScore, ContentScoreSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentService, ContentScoreService } from './services';
import { ProfileScore, ProfilesModule } from '../profiles';
import { ContentDao, ContentScoreDao } from './daos';
import { ContentReadPolicy, ContentWritePolicy } from './policies';
import { ContentEventPublisher, ContentTypeRegistry } from './components';
import { IContentTypeDefinition } from '@/content/interfaces';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { LiveModule } from '@/live/live.module';

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

@Module({})
export class ContentCoreModule {
  static forRoot(): DynamicModule {
    return ContentCoreModule.registerCore();
  }

  static registerCore(): DynamicModule {
    return {
      global: true,
      module: ContentCoreModule,
      imports: [UsersModule, ProfilesModule, ContentModel, ContentScoreActionModel, LiveModule],
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
    };
  }
}

@Module({})
export class ContentModule {
  static forRoot(): DynamicModule {
    return ContentCoreModule.registerCore();
  }

  static registerContentType(...contentTypes: Type<Content>[]): DynamicModule {
    return {
      module: ContentModule,
      imports: [ContentCoreModule.registerCore()],
      providers: [registerContentTypeOnInit(contentTypes)],
    };
  }
}

function registerContentTypeOnInit(contentTypes: Type<Content>[]) {
  @Injectable()
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
