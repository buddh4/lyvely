import { ContentModel, ContentStreamFilter, ENDPOINT_CONTENT_STREAM } from '@lyvely/common';
import { Inject } from '@nestjs/common';
import { UseClassSerializer } from '@lyvely/core';
import { AbstractStreamController } from '@lyvely/stream';
import { Content, ContentStreamService } from '@lyvely/content';
import { ProfileContext, ProfileController } from '@lyvely/profiles';

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
