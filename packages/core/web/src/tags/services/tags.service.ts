import { TagModel, UpdateTagModel, IProfileTagsService, CreateTagModel } from '@lyvely/interface';
import { useSingleton, IEditModelService } from '@lyvely/common';
import repository from '../repositories/tags.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/core';

export class TagsService
  implements IEditModelService<UpdateTagModel, TagModel>, IProfileTagsService
{
  async create(model: CreateTagModel): Promise<TagModel> {
    return unwrapAndTransformResponse(repository.create(model), TagModel);
  }

  async update(id: string, model: UpdateTagModel): Promise<TagModel> {
    return unwrapAndTransformResponse(repository.update(id, model), TagModel);
  }

  async archive(id: string) {
    return unwrapResponse(repository.archive(id));
  }

  async restore(id: string) {
    return unwrapResponse(repository.restore(id));
  }
}

export const useTagsService = useSingleton(() => new TagsService());
