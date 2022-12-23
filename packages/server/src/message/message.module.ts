import { Module } from '@nestjs/common';
import { MessageController } from '@/message/controllers';
import { MessageService } from '@/message/services';
import { MessageDao } from '@/message/daos';
import { ProfilesModule } from '@/profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule, getContentModelDefinition } from '@/content';
import { Message, MessageSchema } from '@/message/schemas';

@Module({
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
