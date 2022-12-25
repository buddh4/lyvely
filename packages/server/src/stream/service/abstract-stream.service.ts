import { Injectable, Logger } from '@nestjs/common';
import {
  IStreamResponse,
  StreamRequest,
  IStreamFilter,
  findByPath,
  IStreamState,
  BaseModel,
  ContentModel,
} from '@lyvely/common';
import { FilterQuery } from 'mongoose';
import {
  AbstractDao,
  assureObjectId,
  BaseEntity,
  EntityIdentity,
  IFetchQueryOptions,
} from '@/core';
import { cloneDeep } from 'lodash';
import { RequestContext } from '@/profiles';
import { DEFAULT_BATCH_SIZE } from '@/stream/stream.constants';
import { Expose, instanceToPlain, Transform } from 'class-transformer';

@Expose()
export class StreamResponse<TResult>
  extends BaseModel<StreamResponse<TResult>>
  implements IStreamResponse<TResult>
{
  @Transform(({ value }) => value.map((elem) => instanceToPlain(elem)))
  models: TResult[];
  state: IStreamState;
  hasMore?: boolean;
}

@Injectable()
export abstract class AbstractStreamService<
  TModel extends BaseEntity<TModel>,
  TResult,
  TFilter extends IStreamFilter = any,
> {
  protected abstract streamEntryDao: AbstractDao<TModel>;
  protected abstract logger: Logger;

  abstract createQueryFilter(context: RequestContext, filter?: TFilter): FilterQuery<TModel>;

  protected abstract mapToResultModel(
    models: TModel[],
    context: RequestContext,
  ): Promise<TResult[]>;
  protected abstract getSortField(): string;

  async loadEntry(
    context: RequestContext,
    identity: EntityIdentity<TModel>,
    filter?: TFilter,
  ): Promise<TResult | null> {
    const streamEntry = await this.streamEntryDao.findByIdAndFilter(
      identity,
      this.createQueryFilter(context, filter),
    );

    if (!streamEntry) return null;

    return (await this.mapToResultModel([streamEntry], context))[0];
  }

  async loadNext(
    context: RequestContext,
    request: StreamRequest,
  ): Promise<IStreamResponse<TResult>> {
    const filter = this.createQueryFilter(context, request.filter);

    if (request.state?.lastOrder) {
      filter[this.getSortField() as keyof FilterQuery<TModel>] = { $lte: request.state.lastOrder };
      if (request.state.lastId) {
        // TODO: we only filter out one potential overlap, there could be other requests with the same sortOrder
        filter['_id'] = { $ne: assureObjectId(request.state.lastId) };
      }
    }

    const batchSize = request.batchSize || DEFAULT_BATCH_SIZE;

    const streamEntries = await this.streamEntryDao.findAll(filter, {
      sort: { [this.getSortField()]: -1 },
      limit: batchSize,
    } as IFetchQueryOptions<TModel>);

    const models = await this.mapToResultModel(streamEntries, context);

    const response = new StreamResponse<TResult>({
      models,
      state: request.state ? cloneDeep(request.state) : {},
      hasMore: true,
    });

    if (streamEntries.length) {
      response.state.lastId = streamEntries[streamEntries.length - 1].id;
      response.state.lastOrder = this.getSortValue(streamEntries[streamEntries.length - 1]);

      if (!response.state.firstId) {
        response.state.firstId = streamEntries[0].id;
        response.state.firstOrder = this.getSortValue(streamEntries[0]);
      }
    }

    if (streamEntries.length < batchSize) {
      response.hasMore = false;
    }

    response.state.isEnd = !response.hasMore;

    return response;
  }

  protected getSortValue(model: TModel) {
    return findByPath(model, this.getSortField());
  }

  async updateStream(
    context: RequestContext,
    request: StreamRequest,
  ): Promise<IStreamResponse<TResult>> {
    const filter = this.createQueryFilter(context, request.filter);

    if (request.state.firstOrder) {
      filter[this.getSortField() as keyof FilterQuery<TModel>] = <any>{
        $gte: request.state.firstOrder,
      };
      if (request.state.firstId) {
        // TODO: we only filter out one potential overlap, there could be other requests with the same sortOrder
        filter['_id'] = { $ne: assureObjectId(request.state.firstId) };
      }
    }

    const batchSize = request.batchSize || DEFAULT_BATCH_SIZE;

    const streamEntries = (
      await this.streamEntryDao.findAll(filter, {
        sort: { [this.getSortField()]: 1 },
        limit: batchSize,
      } as IFetchQueryOptions<TModel>)
    ).reverse();

    const models = await this.mapToResultModel(streamEntries, context);

    const response = new StreamResponse<TResult>({
      models: models,
      state: cloneDeep(request.state),
      hasMore: true,
    });

    if (models.length) {
      response.state.firstId = streamEntries[0].id;
      response.state.firstOrder = this.getSortValue(streamEntries[0]);
    }

    if (models.length < batchSize) {
      response.hasMore = false;
    }

    return response;
  }
}
