import { Post, Body, Req, Param, Get } from '@nestjs/common';
import { IStreamFilter, IStreamResponse, StreamRequest } from '@lyvely/common';
import { ProfileRequest, UserContext } from '@/profiles';
import { AbstractStreamService, StreamResponse } from '../service';
import { BaseEntity } from '@/core';

export abstract class AbstractStreamController<
  TModel extends BaseEntity<TModel>,
  TResult,
  TFilter extends IStreamFilter = any,
> {
  protected abstract streamEntryService: AbstractStreamService<TModel, TResult, TFilter>;

  @Post('load-next')
  async loadTail(
    @Body() streamRequest: StreamRequest<TFilter>,
    @Req() req: ProfileRequest,
  ): Promise<StreamResponse<TResult>> {
    const context = req.context || new UserContext(req.user);
    return this.streamEntryService.loadTail(context, new StreamRequest(streamRequest));
  }

  @Post('loadHead')
  async loadHead(
    @Body() streamRequest: StreamRequest,
    @Req() req: ProfileRequest,
  ): Promise<IStreamResponse<TResult>> {
    const context = req.context || new UserContext(req.user);
    return this.streamEntryService.loadHead(context, new StreamRequest(streamRequest));
  }

  @Get(':nid')
  async loadEntry(@Param('nid') nid: string, @Req() req: ProfileRequest): Promise<TResult> {
    const context = req.context || new UserContext(req.user);
    return this.streamEntryService.loadEntry(context, nid);
  }
}
