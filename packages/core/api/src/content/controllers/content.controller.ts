import {
  API_CONTENT,
  ContentEndpoint,
  SetMilestoneModel,
  ContentEndpoints,
  UpdateTaskListItemModel,
} from '@lyvely/interface';
import { Post, HttpCode, HttpStatus, Param, Request, Put } from '@nestjs/common';
import { Policies } from '@/policies';
import { ContentService } from '../services';
import { ContentDeletePolicy, ContentWritePolicy } from '../policies';
import { ProtectedProfileContentRequest } from '../types';
import { ContentTypeController } from '../decorators';
import { ValidBody } from '@/core';

@ContentTypeController(API_CONTENT)
export class ContentController implements ContentEndpoint {
  constructor(private contentService: ContentService) {}

  @Post(ContentEndpoints.ARCHIVE(':cid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentDeletePolicy)
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
    @ValidBody() model: SetMilestoneModel,
    @Param('cid') cid: string,
    @Request() req: ProtectedProfileContentRequest
  ) {
    const { context } = req;
    await this.contentService.setMilestone(context, model.mid);
  }

  @Put(ContentEndpoints.UPDATE_TASK_LIST_ITEM(':cid'))
  @Policies(ContentWritePolicy)
  async updateTaskListItem(
    @Param('cid') cid: string,
    @ValidBody({ transform: true }) model: UpdateTaskListItemModel,
    @Request() req: ProtectedProfileContentRequest
  ) {
    const { context } = req;
    await this.contentService.updateTaskListItem(context, model);
    //await this.contentService.setMilestone(context, model.mid);
    return context.content.toModel(context.user);
  }
}
