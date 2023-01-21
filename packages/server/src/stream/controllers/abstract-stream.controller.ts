import { Post, Body, Req, Param, Get } from '@nestjs/common';
import { IStreamFilter, IStreamResponse, StreamRequest } from '@lyvely/common';
import { ProfileRequest, RequestContext, UserContext } from '@/profiles';
import { AbstractStreamService, StreamResponse } from '../service';
import { BaseEntity } from '@/core';

export abstract class AbstractStreamController<
  TModel extends BaseEntity<TModel>,
  TResult,
  TFilter extends IStreamFilter = any,
> {
  protected abstract streamEntryService: AbstractStreamService<TModel, TFilter>;

  protected abstract mapToResultModel(
    models: TModel[],
    context: RequestContext,
  ): Promise<TResult[]>;

  @Post('load-next')
  async loadTail(
    @Body() streamRequest: StreamRequest<TFilter>,
    @Req() req: ProfileRequest,
  ): Promise<StreamResponse<TResult>> {
    const context = req.context || new UserContext(req.user);
    const response = await this.streamEntryService.loadTail(
      context,
      new StreamRequest(streamRequest),
    );
    return this.mapResponse(response, context);
  }

  private async mapResponse(
    response: StreamResponse<TModel>,
    context: RequestContext,
  ): Promise<StreamResponse<TResult>> {
    const models = await this.mapToResultModel(response.models, context);
    return new StreamResponse<TResult>({
      models,
      state: response.state,
      hasMore: response.hasMore,
    });
  }

  @Post('load-head')
  async loadHead(
    @Body() streamRequest: StreamRequest,
    @Req() req: ProfileRequest,
  ): Promise<IStreamResponse<TResult>> {
    const context = req.context || new UserContext(req.user);
    const response = await this.streamEntryService.loadHead(
      context,
      new StreamRequest(streamRequest),
    );
    return this.mapResponse(response, context);
  }

  @Get(':cid')
  async loadEntry(@Param(':cid') nid: string, @Req() req: ProfileRequest): Promise<TResult> {
    const context = req.context || new UserContext(req.user);
    const entry = await this.streamEntryService.loadEntry(context, nid);
    return (await this.mapToResultModel([entry], context))[0];
  }
}
