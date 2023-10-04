import { Module } from '@nestjs/common';
import { ProfilesModule } from '@lyvely/profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule, getContentModelDefinition } from '@lyvely/content';
import { SystemMessage, SystemMessageSchema } from './schemas';
import { SystemMessagesService } from './services';
import { SystemMessagesDao } from './daos';

@Module({
  imports: [
    ProfilesModule,
    ContentModule.registerContentType(SystemMessage),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: SystemMessage.name, schema: SystemMessageSchema }]),
    ]),
  ],
  providers: [SystemMessagesService, SystemMessagesDao],
  exports: [SystemMessagesService],
})
export class SystemMessagesModule {}
