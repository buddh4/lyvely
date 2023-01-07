import {
  ContentModel,
  ContentStreamFilter,
  IContentStreamClient,
  IStreamOptions,
  IStreamResponse,
  IStreamState,
  useSingleton,
} from '@lyvely/common';
import repositry from '../repositories';
import { unwrapAndCastResponse, unwrapResponse } from '@/modules/core';
import { getContentType } from '@/modules/content-stream/components/content-stream-entry.registry';

export class ContentStreamService implements IContentStreamClient {
  async loadEntry(id: string, filter?: ContentStreamFilter): Promise<ContentModel> {
    return unwrapAndCastResponse(repositry.loadEntry(id), ContentModel);
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
    return this.createModel(response);
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

    return this.createModel(response);
  }

  private createModel(response: IStreamResponse<ContentModel>) {
    response.models = response.models.map((model) => {
      const ModelClass = getContentType(model.type) || ContentModel;
      return new ModelClass(model);
    });

    return response;
  }
}

export const useContentStreamService = useSingleton(() => new ContentStreamService());
