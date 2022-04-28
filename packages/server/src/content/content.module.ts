import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { Content, ContentSchema, ContentScore, ContentScoreSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentService , ContentScoreService } from './services';
import { ProfileScore, ProfilesModule } from '../profiles';
import { ContentDao , ContentScoreDao } from './daos';
import { ContentReadPolicy , ContentWritePolicy } from './policies';
import { ContentTypeRegistry } from './components';

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

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    ContentModel,
    ContentScoreActionModel
  ],
  controllers: [],
  providers: [
    ContentService,
    ContentDao,
    ContentTypeRegistry,
    ContentReadPolicy,
    ContentWritePolicy,
    ContentScoreService,
    ContentScoreDao
  ],
  exports: [
    ContentModel,
    ContentService,
    ContentScoreService,
    ContentDao,
    ContentTypeRegistry,
    ContentReadPolicy,
    ContentWritePolicy
  ]
})
export class ContentModule {}
