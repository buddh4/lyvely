import { Inject } from '@nestjs/common';
import { AbstractContentTypeController, ContentTypeController } from '@/content';
import { Message } from '../schemas';
import { MessageService } from '../services';
import {
  MessageEndpoint,
  API_MESSAGE,
  CreateMessageModel,
  MessageUpdateResponse,
  UpdateMessageModel,
} from '@lyvely/interface';

@ContentTypeController(API_MESSAGE, Message)
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
