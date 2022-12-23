import {
  ContentModel,
  IContentStreamClient,
  IStreamOptions,
  IStreamResponse,
  IStreamState,
  useSingleton,
} from '@lyvely/common';
import repositry from '../repositories';
import { unwrapAndCastResponse, unwrapResponse } from '@/modules/core';

export class ContentStreamService implements IContentStreamClient {
  async loadEntry(id: string, filter?: any): Promise<ContentModel> {
    return unwrapAndCastResponse(repositry.loadEntry(id), ContentModel);
  }

  async loadNext(
    state: IStreamState,
    options: IStreamOptions,
    filter?: any,
  ): Promise<IStreamResponse<ContentModel, IStreamState>> {
    const response = await unwrapResponse(
      repositry.loadNext({
        state,
        batchSize: options.batchSize,
      }),
    );
    return this.createModel(response);
  }

  async update(
    state: IStreamState,
    options: IStreamOptions,
    filter?: any,
  ): Promise<IStreamResponse<ContentModel, IStreamState>> {
    const response = await unwrapResponse(
      repositry.update({
        state,
        batchSize: options.batchSize,
      }),
    );

    return this.createModel(response);
  }

  private createModel(response: IStreamResponse<ContentModel, IStreamState>) {
    response.models = response.models.map((model) => new ContentModel(model));
    return response;
  }
}

export const useContentStreamService = useSingleton(() => new ContentStreamService());
