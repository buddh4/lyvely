import { ContentModel, ContentRequestFilter } from '../models';
import { IContentStreamClient } from './content-stream.endpoint';
import { IStreamOptions, IStreamResponse, IStreamState } from '@/streams';
import { useSingleton, PropertiesOf, createBaseModelAndInit } from '@lyvely/common';
import repositry from './content-stream.repository';
import { IProfileApiRequestOptions, unwrapResponse } from '@/endpoints';
import { getContentModelType } from '../registries';

export class ContentStreamClient implements IContentStreamClient {
  async loadEntry(
    id: string,
    filter?: ContentRequestFilter,
    options?: IProfileApiRequestOptions
  ): Promise<ContentModel> {
    return this.createModel(await unwrapResponse(repositry.loadEntry(id, options)));
  }

  async loadTail(
    state: IStreamState,
    options: IStreamOptions,
    filter?: ContentRequestFilter,
    requestOptions?: IProfileApiRequestOptions
  ): Promise<IStreamResponse<ContentModel>> {
    const response = await unwrapResponse(
      repositry.loadTail(
        {
          state,
          filter,
          batchSize: options.batchSize,
        },
        requestOptions
      )
    );
    return this.createModels(response);
  }

  async loadHead(
    state: IStreamState,
    options: IStreamOptions,
    filter?: ContentRequestFilter,
    requestOptions?: IProfileApiRequestOptions
  ): Promise<IStreamResponse<ContentModel>> {
    const response = await unwrapResponse(
      repositry.loadHead(
        {
          state,
          filter,
          batchSize: options.batchSize,
        },
        requestOptions
      )
    );

    return this.createModels(response);
  }

  private createModels(response: IStreamResponse<ContentModel>) {
    response.models = response.models.map((model) => this.createModel(model));

    return response;
  }

  private createModel(model: PropertiesOf<ContentModel>) {
    const ModelClass = this.getModelClass(model.type);
    return createBaseModelAndInit(ModelClass, model);
  }

  private getModelClass(type: string) {
    return getContentModelType(type) || ContentModel;
  }
}

export const useContentStreamClient = useSingleton(() => new ContentStreamClient());
