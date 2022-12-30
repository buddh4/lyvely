import { Body, Param, Post, Put, Request } from '@nestjs/common';
import { Content } from '../schemas';
import { AbstractContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { Policies } from '@/policies';
import { ContentWritePolicy } from '../policies';
import {
  AbstractContentEndpoint,
  ContentModel,
  CreateContentModel,
  TagModel,
  ContentUpdateResponse,
  Type,
} from '@lyvely/common';
import { Profile, ProfileRequest } from '@/profiles';
import { User } from '@/users';

export abstract class AbstractContentController<
  TContent extends Content,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
  TModel extends ContentModel = ReturnType<TContent['toModel']>,
> implements AbstractContentEndpoint<TModel, TCreateModel, TUpdateModel>
{
  protected abstract contentService: AbstractContentService<TContent, TCreateModel>;
  protected abstract updateResponseType: Type<ContentUpdateResponse<TModel>>;

  @Post()
  //@ProfilePermissions(ActivityPermissions.CREATE)
  async create(
    @Body() model: TCreateModel,
    @Request() req: ProfileRequest,
  ): Promise<ContentUpdateResponse<TModel>> {
    const { user, profile } = req;
    // TODO: check content specific write permission
    const content = await this.contentService.createContent(profile, user, model);
    return this.createUpdateResponse(profile, user, content);
  }

  @Put(':cid')
  @Policies(ContentWritePolicy)
  async update(
    @Param('cid') cid: string,
    @Body() update: TUpdateModel,
    @Request() req: ProfileContentRequest<TContent>,
  ): Promise<ContentUpdateResponse<TModel>> {
    const { user, profile, content } = req;
    const result = await this.contentService.updateContent(profile, user, content, update);
    return this.createUpdateResponse(profile, user, result);
  }

  protected async createUpdateResponse(
    profile: Profile,
    user: User,
    content: TContent,
  ): Promise<ContentUpdateResponse<TModel>> {
    const ResponseConstructor = this.updateResponseType;
    const response = new ResponseConstructor();
    response.model = <TModel>content.toModel(user);
    response.tags = profile.getNewTags().map((tag) => new TagModel(tag));
    return response;
  }

  @Post(':cid/archive')
  @Policies(ContentWritePolicy)
  async archive(@Param('cid') cid: string, @Request() req: ProfileContentRequest<TContent>) {
    const { context, content } = req;
    await this.contentService.archive(context, content);
  }

  @Post(':cid/unarchive')
  @Policies(ContentWritePolicy)
  async unarchive(@Param('cid') cid: string, @Request() req: ProfileContentRequest<TContent>) {
    const { context, content } = req;
    await this.contentService.unarchive(context, content);
  }
}
