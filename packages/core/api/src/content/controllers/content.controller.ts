import {
  API_CONTENT,
  ContentEndpoint,
  SetMilestoneModel,
  ContentEndpoints,
  UpdateTaskListItemModel,
  ContentSearchResult,
  ContentInfoModel,
  ContentInfoResultModel,
} from '@lyvely/interface';
import { Post, HttpCode, HttpStatus, Param, Request, Put, Get, Query } from '@nestjs/common';
import { Policies } from '@/policies';
import { ContentService } from '../services';
import { ContentDeletePolicy, ContentWritePolicy } from '../policies';
import { ProtectedProfileContentRequest } from '../types';
import { ContentTypeController } from '../decorators';
import { ValidBody } from '@/core';
import type { ProfileRequest } from '@/profiles';
import { isMongoId } from 'class-validator';
import type { IContentInfoResult, IContentSearchQuery } from '@lyvely/interface';

@ContentTypeController(API_CONTENT)
export class ContentController implements ContentEndpoint {
  constructor(private contentService: ContentService) {}

  @Get(ContentEndpoints.SEARCH)
  async search(
    @Query() filter: IContentSearchQuery,
    @Request() req: ProfileRequest
  ): Promise<ContentSearchResult> {
    const { context } = req;
    const content = await this.contentService.search(context, {
      tagIds: filter.tagId ? [filter.tagId] : undefined,
      archived: filter.archived,
      query: filter.query,
      type: filter.type,
    });
    return new ContentSearchResult({ result: content.map((c) => c.toModel(context.user)) });
  }

  @Get(ContentEndpoints.INFOS)
  async getInfos(
    @Param('cids') cids: string[],
    @Request() req: ProfileRequest
  ): Promise<IContentInfoResult> {
    const { context } = req;
    cids = cids.filter(isMongoId);
    const result = await this.contentService.findByIds(context, cids.filter(isMongoId));
    const infos = result.map((content) => content.getInfo());
    return new ContentInfoResultModel({ infos });
  }

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
