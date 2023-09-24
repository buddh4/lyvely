import { Post, Body, Req, Param, Get, NotFoundException } from '@nestjs/common';
import {
  IStreamFilter,
  IStreamResponse,
  StreamRequest,
  StreamResponse,
} from '@lyvely/streams-interface';
import { ProfileRequest, RequestContext, UserContext } from '@lyvely/profiles';
import { AbstractStreamService } from '../service';
import { BaseEntity } from '@lyvely/core';
import { PropertiesOf } from '@lyvely/common';

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
      new StreamRequest(streamRequest as PropertiesOf<StreamRequest>),
    );
    return this.mapResponse(response, context);
  }

  @Get(':eid')
  async loadEntry(@Param('eid') eid: string, @Req() req: ProfileRequest): Promise<TResult> {
    const context = req.context || new UserContext(req.user);
    if (!eid) throw new NotFoundException();
    const entry = await this.streamEntryService.loadEntry(context, eid);
    return (await this.mapToResultModel([entry], context))[0];
  }
}