import { Endpoint } from '@/endpoints';
import { IEditModelClient } from '@/common';
import { ContentUpdateResponse, CreateBaseContentModel } from '../models';
import { IContent } from '../interfaces';

export interface IContentTypeClient<
  TModel extends IContent<string>,
  TCreateModel extends CreateBaseContentModel,
  TUpdateModel extends Partial<CreateBaseContentModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
> extends IEditModelClient<TResponse, TCreateModel, TUpdateModel> {
  create(model: TCreateModel): Promise<TResponse>;
  update(id: string, model: TUpdateModel): Promise<TResponse>;
}

export type ContentTypeEndpoint<
  TModel extends IContent<string>,
  TCreateModel extends CreateBaseContentModel,
  TUpdateModel extends Partial<CreateBaseContentModel> = Partial<TCreateModel>,
> = Endpoint<IContentTypeClient<TModel, TCreateModel, TUpdateModel>>;
