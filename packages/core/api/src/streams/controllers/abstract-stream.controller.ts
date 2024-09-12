import { Post, Req, Param, Get, NotFoundException, Body } from '@nestjs/common';
import {
  IStreamFilter,
  IStreamResponse,
  StreamEndpoints,
  StreamRequest,
  StreamResponse,
  FieldValidationException,
} from '@lyvely/interface';
import { AbstractStreamService } from '../service';
import { BaseDocument } from '@/core';
import { PropertiesOf, type Type, createBaseModelAndInit } from '@lyvely/common';
import type { IOptionalUserContext, UserRequest } from '@/users';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export abstract class AbstractStreamController<
  TModel extends BaseDocument,
  TResult,
  TFilter extends IStreamFilter = any,
  TContext extends IOptionalUserContext = IOptionalUserContext,
> {
  protected abstract streamEntryService: AbstractStreamService<TModel, TFilter>;

  protected abstract requestModelType: Type<StreamRequest<TFilter>>;

  protected abstract mapToResultModel(models: TModel[], context: TContext): Promise<TResult[]>;

  @Post(StreamEndpoints.TAIL)
  async loadTail(
    @Body() streamRequest: StreamRequest<TFilter>,
    @Req() req: UserRequest & { context: TContext }
  ): Promise<StreamResponse<TResult>> {
    const context = req.context || { user: req.user };

    streamRequest = await this.transformAndValidateRequest(streamRequest);

    const response = await this.streamEntryService.loadTail(context, streamRequest);
    return this.mapResponse(response, context);
  }

  private async transformAndValidateRequest(
    raw: PropertiesOf<StreamRequest<TFilter>>
  ): Promise<StreamRequest<TFilter>> {
    const instance = plainToInstance(this.requestModelType, raw);
    const requestModel = createBaseModelAndInit(this.requestModelType, instance);
    const errors = await validate(requestModel);
    if (errors.length) throw new FieldValidationException(errors);
    return requestModel;
  }

  private async mapResponse(
    response: StreamResponse<TModel>,
    context: TContext
  ): Promise<StreamResponse<TResult>> {
    const models = await this.mapToResultModel(response.models, context);
    return new StreamResponse<TResult>({
      models,
      state: response.state,
      hasMore: response.hasMore,
    });
  }

  @Post(StreamEndpoints.HEAD)
  async loadHead(
    @Body() streamRequest: StreamRequest<TFilter>,
    @Req() req: { context: TContext }
  ): Promise<IStreamResponse<TResult>> {
    const context = req.context;

    streamRequest = await this.transformAndValidateRequest(streamRequest);

    const response = await this.streamEntryService.loadHead(context, streamRequest);
    return this.mapResponse(response, context);
  }

  @Get(':eid')
  async loadEntry(@Param('eid') eid: string, @Req() req: { context: TContext }): Promise<TResult> {
    const context = req.context;
    if (typeof eid !== 'string') throw new NotFoundException();
    const entry = await this.streamEntryService.loadEntry(context, eid);
    return (await this.mapToResultModel([entry], context))[0];
  }
}
