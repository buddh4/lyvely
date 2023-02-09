import { AbstractStreamService } from '@/stream';
import { ContentStreamFilter } from '@lyvely/common';
import { Inject, Logger } from '@nestjs/common';
import { Content, ContentDao } from '@/content';
import { RequestContext } from '@/profiles';
import { FilterQuery } from 'mongoose';
import { assureObjectId } from '@/core';

export class ContentStreamService extends AbstractStreamService<Content, ContentStreamFilter> {
  @Inject()
  protected streamEntryDao: ContentDao;
  protected logger = new Logger(ContentStreamService.name);

  createQueryFilter(context: RequestContext, filter?: ContentStreamFilter): FilterQuery<Content> {
    const query = { pid: context.pid, oid: context.oid } as FilterQuery<Content>;
    return this.applyFilter(query, filter);
  }

  protected createLoadEntryQueryFilter(
    context: RequestContext,
    filter?: ContentStreamFilter,
  ): FilterQuery<Content> {
    const query = this.createQueryFilter(context, filter);
    // In case we load a single entry we do need to remove the auto parent = null filter
    if (!filter?.parent) {
      delete query['meta.parentId'];
    }
    return query;
  }

  applyFilter(query: FilterQuery<Content>, filter?: ContentStreamFilter) {
    query['meta.parentId'] = filter?.parent ? assureObjectId(filter.parent) : null;

    if (!filter) return query;

    if (filter.tagIds?.length) {
      query['tagIds'] = { $all: filter.tagIds };
    }

    if (filter.archived) {
      query['meta.isArchived'] = true;
    } else {
      query['meta.isArchived'] = { $ne: true };
    }

    if (filter.query?.length) {
      query.$text = { $search: filter.query };
    }

    return query;
  }

  protected getSortField(): string {
    return 'meta.streamSort';
  }
}
