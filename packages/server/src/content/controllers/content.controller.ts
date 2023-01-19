import { ENDPOINT_CONTENT, ContentEndpoint } from '@lyvely/common';
import { Post, HttpCode, HttpStatus, Param, Request } from '@nestjs/common';
import { Policies } from '@/policies';
import { ContentService } from '../services';
import { ContentWritePolicy } from '../policies';
import { ProfileContentRequest } from '../types';
import { ContentTypeController } from '../decorators';

@ContentTypeController(ENDPOINT_CONTENT)
export class ContentController implements ContentEndpoint {
  constructor(private contentService: ContentService) {}

  @Post(':cid/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async archive(@Param('cid') cid: string, @Request() req: ProfileContentRequest) {
    const { user, content } = req;
    await this.contentService.archive(user, content);
  }

  @Post(':cid/unarchive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async unarchive(@Param('cid') cid: string, @Request() req: ProfileContentRequest) {
    const { user, content } = req;
    await this.contentService.unarchive(user, content);
  }
}
