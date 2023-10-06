import { AbstractStreamService } from '@lyvely/streams';
import { ContentStreamFilter } from '@lyvely/content-interface';
import { Inject, Logger } from '@nestjs/common';
import { ContentDao } from '../daos';
import { Content } from '../schemas';
import { ProfileContext } from '@lyvely/profiles';
import { FilterQuery } from 'mongoose';
import { assureObjectId } from '@lyvely/core';

export class ContentStreamService extends AbstractStreamService<
  Content,
  ContentStreamFilter,
  ProfileContext
> {
  @Inject()
  protected streamEntryDao: ContentDao;
  protected logger = new Logger(ContentStreamService.name);

  createQueryFilter(context: ProfileContext, filter?: ContentStreamFilter): FilterQuery<Content> {
    const query = { pid: context.pid, oid: context.oid } as FilterQuery<Content>;
    return this.applyFilter(query, filter);
  }

  protected createLoadEntryQueryFilter(
    context: ProfileContext,
    filter?: ContentStreamFilter,
  ): FilterQuery<Content> {
    const query = this.createQueryFilter(context, filter);
    // In case we load a single entry we do need to remove the auto parent = null filter
    if (!filter?.parentId) {
      delete query['meta.parentId'];
    }
    return query;
  }

  applyFilter(query: FilterQuery<Content>, filter?: ContentStreamFilter) {
    query['meta.parentId'] = filter?.parentId ? assureObjectId(filter.parentId) : null;

    if (!filter) return query;

    if (filter.tagIds?.length) {
      query['tagIds'] = { $all: filter.tagIds };
    }

    if (filter.archived) {
      query['meta.archived'] = true;
    } else {
      query['meta.archived'] = { $ne: true };
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