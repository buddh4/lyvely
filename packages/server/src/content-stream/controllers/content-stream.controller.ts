import { ContentModel, ContentStreamFilter, ENDPOINT_CONTENT_STREAM } from '@lyvely/common';
import { Inject } from '@nestjs/common';
import { UseClassSerializer } from '@lyvely/server-core';
import { AbstractStreamController } from '@/stream';
import { Content } from '@/content';
import { ContentStreamService } from '@/content-stream/services/content-stream.service';
import { ProfileContext, ProfileController } from '@/profiles';

@ProfileController(ENDPOINT_CONTENT_STREAM)
@UseClassSerializer()
export class ContentStreamController extends AbstractStreamController<
  Content,
  ContentModel,
  ContentStreamFilter
> {
  @Inject()
  protected streamEntryService: ContentStreamService;

  protected async mapToResultModel(
    models: Content[],
    context: ProfileContext,
  ): Promise<ContentModel[]> {
    return models.map((content) => content.toModel(context.user));
  }
}
