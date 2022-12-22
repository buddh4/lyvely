import { MessagesEndpoint, IStreamResponse, StreamRequest, ContentModel } from '@lyvely/common';
import { Controller, Body, Req, Post, Get, Param } from '@nestjs/common';
import { UserRequest } from '@/users';
import { UseClassSerializer } from '@/core';

@Controller('stream')
@UseClassSerializer()
export class ContentStreamController implements MessagesEndpoint {
  @Post('load-next')
  loadNext(
    @Body() streamRequest: StreamRequest,
    @Req() req: UserRequest,
  ): Promise<IStreamResponse<ContentModel>> {
    return null;
  }

  @Post('load-next')
  update(
    @Body() streamRequest: StreamRequest,
    @Req() req: UserRequest,
  ): Promise<IStreamResponse<ContentModel>> {
    return null;
  }

  @Get(':nid')
  async loadEntry(@Param('nid') nid: string, @Req() req: UserRequest): Promise<ContentModel> {
    return null;
  }
}
