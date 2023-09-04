import { Module } from '@nestjs/common';
import { MessageController } from './controllers';
import { MessageService } from './services';
import { MessageDao } from './daos';
import { ProfilesModule } from '@lyvely/profiles';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule, getContentModelDefinition } from '@lyvely/content';
import { Message, MessageSchema } from './schemas';

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
