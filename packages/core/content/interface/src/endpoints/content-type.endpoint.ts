import { Endpoint } from '@lyvely/common';
import { IEditModelService } from '@lyvely/common';
import { ContentUpdateResponse, CreateContentModel } from '../models';
import { IContent } from '../interfaces';

export interface IContentTypeService<
  TModel extends IContent,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<CreateContentModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
> extends IEditModelService<TResponse, TCreateModel, TUpdateModel> {
  create(model: TCreateModel): Promise<TResponse>;
  update(id: string, model: TUpdateModel): Promise<TResponse>;
}

export type ContentTypeEndpoint<
  TModel extends IContent,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<CreateContentModel> = Partial<TCreateModel>,
> = Endpoint<IContentTypeService<TModel, TCreateModel, TUpdateModel>>;
