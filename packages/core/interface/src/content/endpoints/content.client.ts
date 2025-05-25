import { useSingleton } from '@lyvely/common';
import { IContentClient } from './content.endpoint';
import repository from './content.repository';
import { IProfileApiRequestOptions, unwrapResponse } from '@/endpoints';
import { ContentModel, ContentSearchResult, UpdateTaskListItemModel } from '../models';
import { getContentModelType } from '../registries';
import type { PropertiesOf } from '@lyvely/common';
import type { IContentInfoResult, IContentSearchQuery } from '../interfaces';

export class ContentClient implements IContentClient {
  async search(
    filter: IContentSearchQuery,
    options?: IProfileApiRequestOptions
  ): Promise<ContentSearchResult> {
    const { result } = await unwrapResponse(repository.search(filter, options));
    return new ContentSearchResult({
      result: result.map((content: PropertiesOf<ContentModel>) => this.transformModel(content)),
    });
  }

  async getInfos(
    filter: IContentSearchQuery,
    options?: IProfileApiRequestOptions
  ): Promise<IContentInfoResult> {
    return unwrapResponse(repository.getInfos(filter, options));
  }

  async setMilestone(id: string, mid: string, options?: IProfileApiRequestOptions): Promise<void> {
    return unwrapResponse(repository.setMilestone(id, mid, options));
  }

  async unsetMilestone(id: string, options?: IProfileApiRequestOptions): Promise<void> {
    return unwrapResponse(repository.unssetMilestone(id, options));
  }

  async archive(cid: string, options?: IProfileApiRequestOptions): Promise<void> {
    return unwrapResponse(repository.archive(cid, options));
  }

  async restore(cid: string, options?: IProfileApiRequestOptions): Promise<void> {
    return unwrapResponse(repository.restore(cid, options));
  }

  async attachFile(cid: string, formData: any) {
    return unwrapResponse(repository.attachFile(cid, formData));
  }

  async updateTaskListItem(
    cid: string,
    update: UpdateTaskListItemModel,
    options?: IProfileApiRequestOptions
  ): Promise<ContentModel> {
    const model = await unwrapResponse(repository.updateTaskListItem(cid, update, options));
    return this.transformModel(model);
  }

  private transformModel(model: PropertiesOf<ContentModel>) {
    const ModelClass = this.getModelClass(model.type);
    return new ModelClass(model);
  }

  private getModelClass(type: string) {
    return getContentModelType(type) || ContentModel;
  }
}

export const useContentClient = useSingleton(() => new ContentClient());
