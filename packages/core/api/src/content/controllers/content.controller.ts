import {
  API_CONTENT,
  ContentEndpoint,
  SetMilestoneModel,
  ContentEndpoints,
  UpdateTaskListItemModel,
  ContentSearchResult,
  ContentInfoResultModel,
} from '@lyvely/interface';
import {
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  Put,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  Header,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Policies } from '@/policies';
import { ContentService } from '../services';
import { ContentDeletePolicy, ContentWritePolicy } from '../policies';
import { ProtectedProfileContentRequest } from '../types';
import { ContentTypeController } from '../decorators';
import { assureObjectId, ValidBody } from '@/core';
import { ProfileContext, type ProfileRequest, STORAGE_BUCKET_PROFILE_FILES } from '@/profiles';
import type { IContentInfoResult, IContentSearchQuery } from '@lyvely/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUpload, type IFileInfo, StorageService } from '@/files';
import { Response } from 'express';

@ContentTypeController(API_CONTENT)
export class ContentController implements ContentEndpoint {
  constructor(
    private contentService: ContentService,
    private storageService: StorageService
  ) {}

  @Post(ContentEndpoints.ATTACH_FILE(':cid'))
  @UseInterceptors(FileInterceptor('file'))
  @Policies(ContentWritePolicy)
  async uploadImage(
    // TODO: Implement file upload pipe
    @UploadedFile() file: IFileInfo,
    @Req() req: ProtectedProfileContentRequest
  ): Promise<any> {
    // TODO: Crete db file entry
    return await this.storageService.upload(
      new FileUpload({
        file,
        bucket: STORAGE_BUCKET_PROFILE_FILES,
        createdBy: assureObjectId(req.user),
      })
    );
  }

  @Get(':guid')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  public async download(@Param('guid') guid, @Res() res: Response) {
    const fileStream = await this.storageService.download({
      guid,
      bucket: STORAGE_BUCKET_PROFILE_FILES,
    });

    if (!fileStream) throw new NotFoundException();

    //res.set({ 'Content-Type': 'image/jpeg' });
    fileStream.pipe(res);
  }

  @Get(ContentEndpoints.SEARCH)
  async search(
    @Query() filter: IContentSearchQuery,
    @Request() req: ProfileRequest
  ): Promise<ContentSearchResult> {
    const { context } = req;
    const content = await this.findContent(filter, req.context);
    return new ContentSearchResult({ result: content.map((c) => c.toModel(context.user)) });
  }

  @Get(ContentEndpoints.INFOS)
  async getInfos(
    @Query() filter: IContentSearchQuery,
    @Request() req: ProfileRequest
  ): Promise<IContentInfoResult> {
    const contents = await this.findContent(filter, req.context);
    const infos = contents.map((content) => content.getInfo());
    return new ContentInfoResultModel({ infos });
  }

  /**
   * Searches for content based on the provided filter and context.
   *
   * @param {IContentSearchQuery} filter - The criteria used to filter the search results.
   * @param {ProfileContext} context - The context of the current user profile.
   * @return {Promise<Object>} A promise that resolves to the search results.
   */
  private async findContent(filter: IContentSearchQuery, context: ProfileContext) {
    const tagIds = filter.tagId ? [filter.tagId] : [];
    if (filter.tagIds?.length) {
      tagIds.push(...filter.tagIds);
    }
    return this.contentService.search(context, {
      cids: (filter.cids?.length || 0) > 1 ? filter.cids : undefined,
      cid: filter.cids?.length === 1 ? filter.cids[0] : undefined,
      tagIds: tagIds,
      archived: filter.archived,
      query: filter.query,
      type: filter.type,
    });
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

  @Post(ContentEndpoints.UNSET_MILESTONE(':cid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Policies(ContentWritePolicy)
  async unsetMilestone(@Param('cid') cid: string, @Request() req: ProtectedProfileContentRequest) {
    const { context } = req;
    await this.contentService.unsetMilestone(context);
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
    return context.content.toModel(context.user);
  }
}
