import { Inject } from '@nestjs/common';
import { AbstractContentTypeController, ContentTypeController } from '@/content';
import { Message } from '@/message/schemas/message.schema';
import { MessageService } from '@/message/services/message.service';
import { UseClassSerializer } from '@/core';
import {
  MessageEndpoint,
  ENDPOINT_MESSAGE,
  CreateMessage,
  MessageUpdateResponse,
} from '@lyvely/common';

@ContentTypeController(ENDPOINT_MESSAGE, Message)
// TODO: implement feature registration @Feature('activities')
@UseClassSerializer()
export class MessageController
  extends AbstractContentTypeController<Message, CreateMessage>
  implements MessageEndpoint
{
  @Inject()
  protected contentService: MessageService;

  protected updateResponseType = MessageUpdateResponse;
  protected createModelType = CreateMessage;
  protected updateModelType = CreateMessage;
}
