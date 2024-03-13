import { Endpoint } from '@/endpoints';
import { IEditModelClient } from '@/common';
import { ContentUpdateResponse, CreateContentModel } from '../models';
import { IContent } from '../interfaces';

export interface IContentTypeClient<
  TModel extends IContent<string>,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<CreateContentModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
> extends IEditModelClient<TResponse, TCreateModel, TUpdateModel> {
  create(model: TCreateModel): Promise<TResponse>;
  update(id: string, model: TUpdateModel): Promise<TResponse>;
}

export type ContentTypeEndpoint<
  TModel extends IContent<string>,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<CreateContentModel> = Partial<TCreateModel>,
> = Endpoint<IContentTypeClient<TModel, TCreateModel, TUpdateModel>>;
