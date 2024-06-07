import { AbstractStreamService } from '@/streams';
import { ContentRequestFilter } from '@lyvely/interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ContentDao } from '../daos';
import { Content } from '../schemas';
import { ProfileContext } from '@/profiles';
import { FilterQuery, assureObjectId } from '@/core';
import { ContentPolicyService } from './content-policy.service';

@Injectable()
export class ContentStreamService extends AbstractStreamService<
  Content,
  ContentRequestFilter,
  ProfileContext
> {
  @Inject()
  protected streamEntryDao: ContentDao;

  @Inject()
  protected contentPolicyService: ContentPolicyService;

  protected logger = new Logger(ContentStreamService.name);

  createQueryFilter(context: ProfileContext, filter?: ContentRequestFilter): FilterQuery<Content> {
    const query = { pid: context.pid, oid: context.oid } as FilterQuery<Content>;
    return this.applyFilter(query, filter);
  }

  protected override async prepareModels(
    context: ProfileContext,
    models: Content[]
  ): Promise<Content[]> {
    return await this.contentPolicyService.populateContentPolicies(context, models);
  }

  protected override createLoadEntryQueryFilter(
    context: ProfileContext,
    filter?: ContentRequestFilter
  ): FilterQuery<Content> {
    const query = this.createQueryFilter(context, filter);
    // In case we load a single entry we do need to remove the auto parent = null filter
    if (!filter?.parentId) {
      delete query['meta.parentId'];
    }
    return query;
  }

  applyFilter(query: FilterQuery<Content>, filter?: ContentRequestFilter) {
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

    if (filter.deleted) {
      query['meta.deleted'] = true;
    } else {
      query['meta.deleted'] = { $ne: true };
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
