import { ContentModel, ContentStreamFilter, ENDPOINT_CONTENT_STREAM } from '@lyvely/interface';
import { Inject } from '@nestjs/common';
import { UseClassSerializer } from '@/core';
import { AbstractStreamController } from '@/streams';
import { Content } from '../schemas';
import { ContentStreamService } from '../services';
import { ProfileController, ProfileContext } from '@/profiles';

@ProfileController(ENDPOINT_CONTENT_STREAM)
@UseClassSerializer()
export class ContentStreamController extends AbstractStreamController<
  Content,
  ContentModel<any>,
  ContentStreamFilter,
  ProfileContext
> {
  @Inject()
  protected streamEntryService: ContentStreamService;

  protected async mapToResultModel(
    models: Content[],
    context: ProfileContext,
  ): Promise<ContentModel<any>[]> {
    return models.map((content) => content.toModel(context.user));
  }
}
