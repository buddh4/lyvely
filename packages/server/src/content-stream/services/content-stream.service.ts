import { AbstractStreamService } from '@/stream';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { Inject, Logger } from '@nestjs/common';
import { Content, ContentDao } from '@/content';
import { RequestContext } from '@/profiles';
import { FilterQuery } from 'mongoose';
import { assureObjectId } from '@/core';

export class ContentStreamService extends AbstractStreamService<
  Content,
  ContentModel,
  ContentStreamFilter
> {
  @Inject()
  protected streamEntryDao: ContentDao;
  protected logger = new Logger(ContentStreamService.name);

  createQueryFilter(context: RequestContext, filter?: ContentStreamFilter): FilterQuery<Content> {
    const result = { pid: context.pid, oid: context.oid } as FilterQuery<Content>;

    if (filter) {
      result['meta.parentId'] = filter?.parent ? assureObjectId(filter.parent) : null;
    }

    return result;
  }

  protected getSortField(): string {
    return 'meta.streamSort';
  }

  protected async mapToResultModel(
    models: Content[],
    context: RequestContext,
  ): Promise<ContentModel[]> {
    return models.map((content) => content.toModel(context.user));
  }
}
