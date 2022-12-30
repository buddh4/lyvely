import { Inject } from '@nestjs/common';
import { AbstractContentController, ContentController } from '@/content';
import { Message } from '@/message/schemas/message.schema';
import { MessageService } from '@/message/services/message.service';
import { UseClassSerializer } from '@/core';
import {
  MessageEndpoint,
  ENDPOINT_MESSAGE,
  CreateMessage,
  MessageModel,
  MessageUpdateResponse,
} from '@lyvely/common';

@ContentController(ENDPOINT_MESSAGE, Message)
// TODO: implement feature registration @Feature('activities')
@UseClassSerializer()
export class MessageController
  extends AbstractContentController<Message, CreateMessage>
  implements MessageEndpoint
{
  @Inject()
  protected contentService: MessageService;

  protected updateResponseType = MessageUpdateResponse;
}
