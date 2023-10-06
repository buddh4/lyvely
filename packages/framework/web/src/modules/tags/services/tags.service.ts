import { TagModel, UpdateTagModel, IProfileTagsService } from '@lyvely/profiles-interface';
import { useSingleton, IEditModelService } from '@lyvely/common';
import repository from '../repositories/tags.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

export class TagsService
  implements IEditModelService<UpdateTagModel, TagModel>, IProfileTagsService
{
  async create(model: UpdateTagModel): Promise<TagModel> {
    return unwrapAndTransformResponse(repository.create(model), TagModel);
  }

  async update(id: string, model: UpdateTagModel): Promise<TagModel> {
    return unwrapAndTransformResponse(repository.update(id, model), TagModel);
  }

  async archive(id: string) {
    return unwrapResponse(repository.archive(id));
  }

  async unarchive(id: string) {
    return unwrapResponse(repository.unarchive(id));
  }
}

export const useTagsService = useSingleton(() => new TagsService());
