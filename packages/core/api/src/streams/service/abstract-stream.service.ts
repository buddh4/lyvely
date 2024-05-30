import { Injectable, Logger } from '@nestjs/common';
import {
  IStreamResponse,
  StreamRequest,
  IStreamFilter,
  StreamResponse,
  DocumentNotFoundException,
  SortValue,
} from '@lyvely/interface';
import { findByPath } from '@lyvely/common';
import {
  FilterQuery,
  AbstractDao,
  assureStringId,
  BaseDocument,
  DocumentIdentity,
  IFetchQueryOptions,
} from '@/core';
import { cloneDeep } from 'lodash';
import { DEFAULT_BATCH_SIZE } from '../stream.constants';

@Injectable()
export abstract class AbstractStreamService<
  TModel extends BaseDocument,
  TFilter extends IStreamFilter = any,
  TContext = any,
> {
  protected abstract streamEntryDao: AbstractDao<TModel>;
  protected abstract logger: Logger;

  abstract createQueryFilter(context: TContext, filter?: TFilter): FilterQuery<TModel>;

  protected abstract getSortField(): string;

  /**
   * Loads a single entry filtered by the given filter.
   * @param context
   * @param identity
   * @param filter
   */
  async loadEntry(
    context: TContext,
    identity: DocumentIdentity<TModel>,
    filter?: TFilter
  ): Promise<TModel> {
    const streamEntry = await this.streamEntryDao.findByIdAndFilter(
      identity,
      this.createLoadEntryQueryFilter(context, filter)
    );

    if (!streamEntry) throw new DocumentNotFoundException();

    this.prepareModel(streamEntry, context);

    return streamEntry;
  }

  protected createLoadEntryQueryFilter(context: TContext, filter?: TFilter): FilterQuery<TModel> {
    return this.createQueryFilter(context, filter);
  }

  async loadTail(
    context: TContext,
    request: StreamRequest<TFilter>
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

    streamEntries.forEach((entry) => this.prepareModel(entry, context));

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

  /**
   * This function can be used by subclasses to do further populate or manipulate a model instance.
   *
   * @param {TModel} model - The model to populate.
   * @param context
   * @protected
   * @return {void}
   */
  protected prepareModel(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    model: TModel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: TContext
  ) {
    // Nothing todo.
  }

  protected getSortValue(model: TModel): SortValue {
    return findByPath<SortValue>(model, this.getSortField());
  }

  async loadHead(
    context: TContext,
    request: StreamRequest<TFilter>
  ): Promise<IStreamResponse<TModel>> {
    const filter = this.createQueryFilter(context, request.filter);

    // TODO: make request.state required?
    if (request.state?.head) {
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

    streamEntries.forEach((entry) => this.prepareModel(entry, context));

    const response = new StreamResponse<TModel>({
      models: streamEntries,
      state: cloneDeep(request.state) || {},
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
