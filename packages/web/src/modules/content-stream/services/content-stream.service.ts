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

export class ContentStreamService implements IContentStreamClient {
  async loadEntry(id: string, filter?: ContentStreamFilter): Promise<ContentModel> {
    return unwrapAndCastResponse(repositry.loadEntry(id), ContentModel);
  }

  async loadNext(
    state: IStreamState,
    options: IStreamOptions,
    filter?: ContentStreamFilter,
  ): Promise<IStreamResponse<ContentModel>> {
    const response = await unwrapResponse(
      repositry.loadNext({
        state,
        filter,
        batchSize: options.batchSize,
      }),
    );
    return this.createModel(response);
  }

  async update(
    state: IStreamState,
    options: IStreamOptions,
    filter?: ContentStreamFilter,
  ): Promise<IStreamResponse<ContentModel, IStreamState>> {
    const response = await unwrapResponse(
      repositry.update({
        state,
        filter,
        batchSize: options.batchSize,
      }),
    );

    return this.createModel(response);
  }

  private createModel(response: IStreamResponse<ContentModel>) {
    response.models = response.models.map((model) => new ContentModel(model));
    return response;
  }
}

export const useContentStreamService = useSingleton(() => new ContentStreamService());
