import {
  ContentModel,
  ContentStreamFilter,
  ENDPOINT_CONTENT_STREAM,
} from '@lyvely/content-interface';
import { Inject } from '@nestjs/common';
import { UseClassSerializer } from '@lyvely/core';
import { AbstractStreamController } from '@lyvely/streams';
import { Content } from '../schemas';
import { ContentStreamService } from '../services';
import { ProfileController, ProfileContext } from '@lyvely/profiles';

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