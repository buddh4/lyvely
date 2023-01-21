import {
  ContentModel,
  ContentStreamFilter,
  IContentStreamClient,
  IStreamOptions,
  IStreamResponse,
  IStreamState,
  useSingleton,
  PropertiesOf,
} from '@lyvely/common';
import repositry from '../repositories';
import { unwrapResponse } from '@/modules/core';
import { getContentType } from '@/modules/content-stream/components/content-stream-entry.registry';

export class ContentStreamService implements IContentStreamClient {
  async loadEntry(id: string, filter?: ContentStreamFilter): Promise<ContentModel> {
    return this.createModel(await unwrapResponse(repositry.loadEntry(id)));
  }

  async loadTail(
    state: IStreamState,
    options: IStreamOptions,
    filter?: ContentStreamFilter,
  ): Promise<IStreamResponse<ContentModel>> {
    const response = await unwrapResponse(
      repositry.loadTail({
        state,
        filter,
        batchSize: options.batchSize,
      }),
    );
    return this.createModels(response);
  }

  async loadHead(
    state: IStreamState,
    options: IStreamOptions,
    filter?: ContentStreamFilter,
  ): Promise<IStreamResponse<ContentModel, IStreamState>> {
    const response = await unwrapResponse(
      repositry.loadHead({
        state,
        filter,
        batchSize: options.batchSize,
      }),
    );

    return this.createModels(response);
  }

  private createModels(response: IStreamResponse<ContentModel>) {
    response.models = response.models.map((model) => this.createModel(model));

    return response;
  }

  private createModel(model: PropertiesOf<ContentModel>) {
    const ModelClass = this.getModelClass(model.type);
    return new ModelClass(model);
  }

  private getModelClass(type: string) {
    return getContentType(type) || ContentModel;
  }
}

export const useContentStreamService = useSingleton(() => new ContentStreamService());
