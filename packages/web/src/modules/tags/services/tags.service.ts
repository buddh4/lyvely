import { IEditModelService } from '@/modules/common';
import { TagModel, UpdateTagDto, useSingleton, IProfileTagsService } from '@lyvely/common';
import repository from '../repositories/tags.repository';
import { unwrapAndCastResponse, unwrapResponse } from '@/modules/core';

export class TagsService implements IEditModelService<UpdateTagDto, TagModel>, IProfileTagsService {
  async create(model: UpdateTagDto): Promise<TagModel> {
    return unwrapAndCastResponse(repository.create(model), TagModel);
  }

  async update(id: string, model: UpdateTagDto): Promise<TagModel> {
    return unwrapAndCastResponse(repository.update(id, model), TagModel);
  }

  async archive(id: string) {
    return unwrapResponse(repository.archive(id));
  }

  async unarchive(id: string) {
    return unwrapResponse(repository.unarchive(id));
  }
}

export const useTagsService = useSingleton(() => new TagsService());
