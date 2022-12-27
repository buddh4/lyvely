import { Inject, Body, Post, Get, Req } from '@nestjs/common';
import { AbstractContentController, ContentController } from '@/content';
import { Message } from '@/message/schemas/message.schema';
import { MessageService } from '@/message/services/message.service';
import { UseClassSerializer } from '@/core';
import { MessageEndpoint, ENDPOINT_MESSAGE, CreateMessage, MessageModel } from '@lyvely/common';
import { ProfileRequest } from '@/profiles';

@ContentController(ENDPOINT_MESSAGE, Message)
// TODO: implement feature registration @Feature('activities')
@UseClassSerializer()
export class MessageController
  extends AbstractContentController<Message>
  implements MessageEndpoint
{
  @Inject()
  protected contentService: MessageService;

  @Post()
  async create(
    @Body() createModel: CreateMessage,
    @Req() req: ProfileRequest,
  ): Promise<MessageModel> {
    const { profile, user } = req;
    const model = await this.contentService.createContent(profile, user, createModel);
    return new MessageModel(model);
  }
}
