import { Injectable, Logger } from '@nestjs/common';
import {
  IStreamResponse,
  StreamRequest,
  IStreamFilter,
  findByPath,
  IStreamState,
  BaseModel,
  EntityNotFoundException,
} from '@lyvely/common';
import { FilterQuery } from 'mongoose';
import {
  AbstractDao,
  assureStringId,
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
  TFilter extends IStreamFilter = any,
> {
  protected abstract streamEntryDao: AbstractDao<TModel>;
  protected abstract logger: Logger;

  abstract createQueryFilter(context: RequestContext, filter?: TFilter): FilterQuery<TModel>;

  protected abstract getSortField(): string;

  /**
   * Loads a single entry filtered by the given filter.
   * @param context
   * @param identity
   * @param filter
   */
  async loadEntry(
    context: RequestContext,
    identity: EntityIdentity<TModel>,
    filter?: TFilter,
  ): Promise<TModel> {
    const streamEntry = await this.streamEntryDao.findByIdAndFilter(
      identity,
      this.createLoadEntryQueryFilter(context, filter),
    );

    if (!streamEntry) throw new EntityNotFoundException();

    return streamEntry;
  }

  protected createLoadEntryQueryFilter(
    context: RequestContext,
    filter?: TFilter,
  ): FilterQuery<TModel> {
    return this.createQueryFilter(context, filter);
  }

  async loadTail(
    context: RequestContext,
    request: StreamRequest<TFilter>,
  ): Promise<IStreamResponse<TModel>> {
    const filter = this.createQueryFilter(context, request.filter);

    if (request.state?.tail) {
      filter[this.getSortField() as keyof FilterQuery<TModel>] = { $lte: request.state.tail };
      if (request.state.tailIds?.length) {
        // TODO: we only filter out one potential overlap, there could be other requests with the same sortOrder
        filter['_id'] = { $nin: request.state.tailIds.map((id) => assureStringId(id)) };
      }
    }

    const batchSize = request.batchSize || DEFAULT_BATCH_SIZE;

    const streamEntries = await this.streamEntryDao.findAll(filter, {
      sort: { [this.getSortField()]: -1 },
      limit: batchSize,
    } as IFetchQueryOptions<TModel>);

    const response = new StreamResponse<TModel>({
      models: streamEntries,
      state: request.state ? cloneDeep(request.state) : {},
      hasMore: true,
    });

    if (streamEntries.length) {
      response.state.tailIds = streamEntries
        .filter((entry) => entry.id === streamEntries[streamEntries.length - 1].id)
        .map((entry) => assureStringId(entry));
      response.state.tail = this.getSortValue(streamEntries[streamEntries.length - 1]);

      if (!response.state.headIds?.length) {
        response.state.headIds = [streamEntries[0].id];
        response.state.head = this.getSortValue(streamEntries[0]);
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

  async loadHead(
    context: RequestContext,
    request: StreamRequest<TFilter>,
  ): Promise<IStreamResponse<TModel>> {
    const filter = this.createQueryFilter(context, request.filter);

    if (request.state.head) {
      filter[this.getSortField() as keyof FilterQuery<TModel>] = <any>{
        $gte: request.state.head,
      };
      if (request.state.headIds?.length) {
        // TODO: we only filter out one potential overlap, there could be other requests with the same sortOrder
        filter['_id'] = { $nin: request.state.headIds.map((id) => assureStringId(id)) };
      }
    }

    const batchSize = request.batchSize || DEFAULT_BATCH_SIZE;

    const streamEntries = (
      await this.streamEntryDao.findAll(filter, {
        sort: { [this.getSortField()]: 1 },
        limit: batchSize,
      } as IFetchQueryOptions<TModel>)
    ).reverse();

    const response = new StreamResponse<TModel>({
      models: streamEntries,
      state: cloneDeep(request.state),
      hasMore: true,
    });

    if (streamEntries.length) {
      response.state.headIds = streamEntries
        .filter((entry) => entry.id === streamEntries[0].id)
        .map((entry) => assureStringId(entry));
      response.state.head = this.getSortValue(streamEntries[0]);
    }

    if (streamEntries.length < batchSize) {
      response.hasMore = false;
    }

    return response;
  }
}
