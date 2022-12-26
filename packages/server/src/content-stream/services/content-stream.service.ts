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
    const result = { pid: context.pid } as FilterQuery<Content>;

    if (filter?.parent) {
      result['parentId'] = assureObjectId(filter.parent);
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
    return models.map((content) => content.toModel());
  }
}
