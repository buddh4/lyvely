import { Endpoint } from '@/endpoints';
import { IArchiveModelService, IEditModelService } from '@/models';
import { ContentUpdateResponse, CreateContentModel } from '../models';
import { IContent } from '../interfaces';

export interface IAbstractContentService<
  TModel extends IContent,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<CreateContentModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
> extends IEditModelService<TResponse, TCreateModel, TUpdateModel>,
    IArchiveModelService {
  create(model: TCreateModel): Promise<TResponse>;
  update(id: string, model: TUpdateModel): Promise<TResponse>;
  archive(contentId: string): Promise<void>;
  unarchive(contentId: string): Promise<void>;
}

export type AbstractContentEndpoint<
  TModel extends IContent,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<CreateContentModel> = Partial<TCreateModel>,
> = Endpoint<IAbstractContentService<TModel, TCreateModel, TUpdateModel>>;
