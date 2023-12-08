import {
  API_CONTENT,
  ContentEndpoint,
  SetMilestoneModel,
  ContentEndpoints,
} from '@lyvely/interface';
import { Post, HttpCode, HttpStatus, Param, Request, Body } from '@nestjs/common';
import { Policies } from '@/policies';
import { ContentService } from '../services';
import { ContentWritePolicy } from '../policies';
import { ProtectedProfileContentRequest } from '../types';
import { ContentTypeController } from '../decorators';

@ContentTypeController(API_CONTENT)
export class ContentController implements ContentEndpoint {
  constructor(private contentService: ContentService) {}

  @Post(ContentEndpoints.ARCHIVE(':cid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async archive(@Param('cid') cid: string, @Request() req: ProtectedProfileContentRequest) {
    const { user, content } = req;
    await this.contentService.archive(user, content);
  }

  @Post(ContentEndpoints.RESTORE(':cid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async restore(@Param('cid') cid: string, @Request() req: ProtectedProfileContentRequest) {
    const { user, content } = req;
    await this.contentService.restore(user, content);
  }

  @Post(ContentEndpoints.SET_MILESTONE(':cid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async setMilestone(
    @Body() model: SetMilestoneModel,
    @Param('cid') cid: string,
    @Request() req: ProtectedProfileContentRequest,
  ) {
    const { profile, user, content } = req;
    await this.contentService.setMilestone(profile, user, content, model.mid);
  }
}
