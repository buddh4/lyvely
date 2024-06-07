import { MessageController } from './controllers';
import { MessageService } from './services';
import { MessageDao } from './daos';
import { ProfilesModule } from '@/profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule, getContentModelDefinition } from '@/content';
import { Message, MessageSchema } from './schemas';
import { LyvelyModule } from '@/core';
import { MESSAGES_MODULE_ID, MessagePermissions } from '@lyvely/interface';

@LyvelyModule({
  id: MESSAGES_MODULE_ID,
  path: __dirname,
  permissions: MessagePermissions,
  imports: [
    ProfilesModule,
    ContentModule.registerContentType(Message),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Message.name, schema: MessageSchema }]),
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageDao],
})
export class MessageModule {}
