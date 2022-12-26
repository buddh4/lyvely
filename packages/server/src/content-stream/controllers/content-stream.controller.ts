import { ContentModel, ContentStreamFilter, ENDPOINT_CONTENT_STREAM } from '@lyvely/common';
import { Inject } from '@nestjs/common';
import { UseClassSerializer } from '@/core';
import { AbstractStreamController } from '@/stream';
import { Content } from '@/content';
import { ContentStreamService } from '@/content-stream/services/content-stream.service';
import { ProfileController } from '@/profiles';

@ProfileController(ENDPOINT_CONTENT_STREAM)
@UseClassSerializer()
export class ContentStreamController extends AbstractStreamController<
  Content,
  ContentModel,
  ContentStreamFilter
> {
  @Inject()
  protected streamEntryService: ContentStreamService;
}
