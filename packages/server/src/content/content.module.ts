import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { Content, ContentSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentService } from './services';
import { ProfilesModule } from '../profiles';
import { ContentDao } from './daos';
import { ContentReadPolicy , ContentWritePolicy } from './policies';

import { ContentTypeRegistry } from './components';

const MongooseContentModel = MongooseModule.forFeature([
  {
    name: Content.name,
    schema: ContentSchema,
  },
])

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    MongooseContentModel
  ],
  controllers: [],
  providers: [
    ContentService,
    ContentDao,
    ContentTypeRegistry,
    ContentReadPolicy,
    ContentWritePolicy
  ],
  exports: [
    MongooseContentModel,
    ContentService,
    ContentDao,
    ContentTypeRegistry,
    ContentReadPolicy,
    ContentWritePolicy
  ]
})
export class ContentModule {}
