import { AbstractStreamService } from '@/streams';
import { ContentRequestFilter } from '@lyvely/interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { buildContentFilterQuery, ContentDao } from '../daos';
import { Content } from '../schemas';
import { ProfileContext } from '@/profiles';
import { FilterQuery } from '@/core';
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

  createQueryFilter(context: ProfileContext, filter?: ContentRequestFilter): FilterQuery<Content> {
    return buildContentFilterQuery({
      pid: context.pid,
      oid: context.oid,
      archived: false,
      deleted: false,
      ...filter,
    });
  }

  protected getSortField(): string {
    return 'meta.streamSort';
  }
}
