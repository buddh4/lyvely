import { Post, Body, Req, Param, Get, NotFoundException } from '@nestjs/common';
import {
  IStreamFilter,
  IStreamResponse,
  StreamRequest,
  StreamResponse,
} from '@lyvely/core-interface';
import { AbstractStreamService } from '../service';
import { BaseEntity } from '@/core';
import { PropertiesOf } from '@lyvely/common';

export abstract class AbstractStreamController<
  TModel extends BaseEntity<TModel>,
  TResult,
  TFilter extends IStreamFilter = any,
  TContext = any,
> {
  protected abstract streamEntryService: AbstractStreamService<TModel, TFilter>;

  protected abstract mapToResultModel(models: TModel[], context: TContext): Promise<TResult[]>;

  @Post('load-next')
  async loadTail(
    @Body() streamRequest: StreamRequest<TFilter>,
    @Req() req: { context: TContext },
  ): Promise<StreamResponse<TResult>> {
    const context = req.context;
    const response = await this.streamEntryService.loadTail(
      context,
      new StreamRequest(streamRequest),
    );
    return this.mapResponse(response, context);
  }

  private async mapResponse(
    response: StreamResponse<TModel>,
    context: TContext,
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
    @Req() req: { context: TContext },
  ): Promise<IStreamResponse<TResult>> {
    const context = req.context;
    const response = await this.streamEntryService.loadHead(
      context,
      new StreamRequest(streamRequest as PropertiesOf<StreamRequest>),
    );
    return this.mapResponse(response, context);
  }

  @Get(':eid')
  async loadEntry(@Param('eid') eid: string, @Req() req: { context: TContext }): Promise<TResult> {
    const context = req.context;
    if (!eid) throw new NotFoundException();
    const entry = await this.streamEntryService.loadEntry(context, eid);
    return (await this.mapToResultModel([entry], context))[0];
  }
}
