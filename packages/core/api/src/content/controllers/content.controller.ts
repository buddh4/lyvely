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
import { ContentDeletePolicy, ContentWritePolicy, ContentReadPolicy } from '../policies';
import { ProfileContentRequest, ProtectedProfileContentRequest } from '../types';
import { ContentTypeController } from '../decorators';
import { assureStringId, ValidBody } from '@/core';
import { ProfileContext, type ProfileRequest, STORAGE_BUCKET_PROFILE_FILES } from '@/profiles';
import type { IContentInfoResult, IContentSearchQuery, IFileSummary } from '@lyvely/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigurableFileValidationPipe, type IFileInfo, StorageService } from '@/files';
import { Response } from 'express';

@ContentTypeController(API_CONTENT)
export class ContentController implements ContentEndpoint {
  constructor(
    private contentService: ContentService,
    private storageService: StorageService
  ) {}

  @Put(ContentEndpoints.ATTACH_FILE(':cid'))
  @UseInterceptors(FileInterceptor('file'))
  @Policies(ContentWritePolicy)
  async attachFile(
    // TODO: Implement file upload pipe
    @UploadedFile(ConfigurableFileValidationPipe) file: IFileInfo,
    @Req() req: ProtectedProfileContentRequest
  ): Promise<any> {
    return await this.contentService.attachFile(req.context, file);
  }

  @Get(ContentEndpoints.DOWNLOAD_ATTACHED_FILE(':cid', ':fileId'))
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  public async downloadAttachedFile(
    @Request() req: ProfileContentRequest,
    @Param('fileId') fileId,
    @Res() res: Response
  ): Promise<any> {
    // TODO: This does not seem to work for guest users
    const file = await this.contentService.getAttachedFileInfo(req.context, fileId);
    if (!file) throw new NotFoundException();
    const fileStream = await this.storageService.download({
      guid: file.guid,
      bucket: STORAGE_BUCKET_PROFILE_FILES,
    });
    if (!fileStream) throw new NotFoundException();
    res.set({
      'Content-Type': file.meta.mimeType,
      'Content-Disposition': `attachment; filename="${file.meta.name}"`,
    });
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

  @Get(ContentEndpoints.ATTACHED_FILE_INFOS(':cid'))
  @Policies(ContentReadPolicy)
  async getAttachedFileInfos(
    @Request() req: ProfileContentRequest
  ): Promise<{ files: IFileSummary[] }> {
    const fileInfos = await this.contentService.getAttachedFileInfos(req.context);
    const files: IFileSummary[] = fileInfos.map((file) => ({
      id: assureStringId(file),
      ...file.meta,
    }));
    return { files };
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
