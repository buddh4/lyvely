import { Body, Param, Post, Put, Request } from '@nestjs/common';
import { Content } from '../schemas';
import { ContentTypeService } from '../services';
import { ProtectedProfileContentRequest } from '../types';
import { ContentCreatePolicy, ContentWritePolicy } from '../policies';
import { Type, BaseModel, PropertiesOf, createAndAssign } from '@lyvely/common';
import {
  ContentTypeEndpoint,
  ContentModel,
  CreateContentModel,
  ContentUpdateResponse,
  FieldValidationException,
  TagModel,
} from '@lyvely/interface';
import { ProtectedProfileContext, ProtectedProfileRequest } from '@/profiles';
import { validate } from 'class-validator';
import { Policies } from '@/policies';
import { plainToInstance } from 'class-transformer';

export abstract class AbstractContentTypeController<
  TContent extends Content,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
  TModel extends ContentModel<any> = ReturnType<TContent['toModel']>,
> implements ContentTypeEndpoint<TModel, TCreateModel, TUpdateModel>
{
  // We need those models, since the validation pipeline can not determine the type of generic body types
  protected abstract createModelType: Type<BaseModel<any>>;
  protected abstract updateModelType: Type<BaseModel<any>>;
  protected abstract updateResponseType: Type<ContentUpdateResponse<TModel>>;
  protected abstract contentService: ContentTypeService<TContent, TCreateModel>;

  @Post()
  @Policies(ContentCreatePolicy)
  async create(
    @Body() body: PropertiesOf<TCreateModel>,
    @Request() req: ProtectedProfileRequest,
  ): Promise<ContentUpdateResponse<TModel>> {
    // TODO: check content specific write permission
    const { context } = req;
    const model = this.transformCreateModel(body);
    await this.validateModel(model);
    const content = await this.contentService.createContent(context, model);
    return this.createUpdateResponse(context, content);
  }

  private transformCreateModel(raw: PropertiesOf<TCreateModel>): TCreateModel {
    const test = plainToInstance(this.createModelType, raw);
    return createAndAssign(this.createModelType, test);
  }

  @Put(':cid')
  @Policies(ContentWritePolicy)
  async update(
    @Param('cid') cid: string,
    @Body() body: PropertiesOf<TUpdateModel>,
    @Request() req: ProtectedProfileContentRequest<TContent>,
  ): Promise<ContentUpdateResponse<TModel>> {
    const { context, content } = req;
    const model = this.transformUpdateModel(body);
    await this.validateModel(model);
    const result = await this.contentService.updateContent(context, content, model);
    return this.createUpdateResponse(context, result);
  }

  private async validateModel(model: any) {
    const errors = await validate(model);
    if (errors.length) throw new FieldValidationException(errors);
  }

  private transformUpdateModel(raw: PropertiesOf<TUpdateModel>): TUpdateModel {
    return createAndAssign(this.updateModelType, raw);
  }

  protected async createUpdateResponse(
    context: ProtectedProfileContext,
    content: TContent,
  ): Promise<ContentUpdateResponse<TModel>> {
    const { user, profile } = context;
    const ResponseConstructor = this.updateResponseType;
    const response = new ResponseConstructor();
    response.model = <TModel>content.toModel(user);
    response.tags = profile.getNewTags().map((tag) => new TagModel(tag));
    return response;
  }
}
