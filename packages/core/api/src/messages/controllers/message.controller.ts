import { Inject } from '@nestjs/common';
import { AbstractContentTypeController, ContentTypeController } from '@/content';
import { Message } from '../schemas';
import { MessageService } from '../services';
import { UseClassSerializer } from '@/core';
import {
  MessageEndpoint,
  ENDPOINT_MESSAGE,
  CreateMessageModel,
  MessageUpdateResponse,
  UpdateMessageModel,
} from '@lyvely/core-interface';

@ContentTypeController(ENDPOINT_MESSAGE, Message)
@UseClassSerializer()
export class MessageController
  extends AbstractContentTypeController<Message, CreateMessageModel>
  implements MessageEndpoint
{
  @Inject()
  protected contentService: MessageService;

  protected updateResponseType = MessageUpdateResponse;
  protected createModelType = CreateMessageModel;
  protected updateModelType = UpdateMessageModel;
}
