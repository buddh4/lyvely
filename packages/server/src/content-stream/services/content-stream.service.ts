import { AbstractStreamService, StreamSortField } from '@/stream';
import { ContentModel, StreamRequest } from '@lyvely/common';
import { Content } from '@/content';
import { RequestContext } from '@/profiles';
import { FilterQuery } from 'mongoose';

export class ContentStreamService extends AbstractStreamService<Content, ContentModel> {
  createFilterQuery(context: RequestContext, request: StreamRequest): FilterQuery<Content> {
    return { pid: context.pid };
  }

  protected getSortField(): StreamSortField<Content> {
    return 'meta.streamSort';
  }

  protected mapToResultModel(models: Content[], context: RequestContext): Promise<ContentModel[]> {
    models.map((content) => content.to);
  }
}
