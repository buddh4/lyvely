import { ENDPOINT_CONTENT, ContentEndpoint, SetMilestoneModel } from '@lyvely/content-interface';
import { Post, HttpCode, HttpStatus, Param, Request, Body } from '@nestjs/common';
import { Policies } from '@lyvely/policies';
import { ContentService } from '../services';
import { ContentWritePolicy } from '../policies';
import { ProfileContentRequest, ProfileUserContentRequest } from '../types';
import { ContentTypeController } from '../decorators';

@ContentTypeController(ENDPOINT_CONTENT)
export class ContentController implements ContentEndpoint {
  constructor(private contentService: ContentService) {}

  @Post(':cid/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async archive(@Param('cid') cid: string, @Request() req: ProfileUserContentRequest) {
    const { user, content } = req;
    await this.contentService.archive(user, content);
  }

  @Post(':cid/unarchive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async unarchive(@Param('cid') cid: string, @Request() req: ProfileUserContentRequest) {
    const { user, content } = req;
    await this.contentService.unarchive(user, content);
  }

  @Post(':cid/set-milestone')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async setMilestone(
    @Body() model: SetMilestoneModel,
    @Param('cid') cid: string,
    @Request() req: ProfileUserContentRequest,
  ) {
    const { profile, user, content } = req;
    await this.contentService.setMilestone(profile, user, content, model.mid);
  }
}
