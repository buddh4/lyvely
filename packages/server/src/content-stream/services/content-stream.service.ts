import { AbstractStreamService, StreamSortField } from '@/stream';
import { ContentModel, StreamRequest } from '@lyvely/common';
import { Inject, Logger } from '@nestjs/common';
import { Content, ContentDao } from '@/content';
import { RequestContext } from '@/profiles';
import { FilterQuery } from 'mongoose';

export class ContentStreamService extends AbstractStreamService<Content, ContentModel> {
  @Inject()
  protected streamEntryDao: ContentDao;
  protected logger = new Logger(ContentStreamService.name);

  createQueryFilter(context: RequestContext, request: StreamRequest): FilterQuery<Content> {
    return { pid: context.pid };
  }

  protected getSortField(): StreamSortField<Content> {
    return 'meta.streamSort';
  }

  protected async mapToResultModel(
    models: Content[],
    context: RequestContext,
  ): Promise<ContentModel[]> {
    return models.map((content) => content.toModel());
  }
}
