import { TagModel, UpdateTagModel, CreateTagModel } from '../models';
import { IProfileTagsClient } from './profile-tags.endpoint';
import { useSingleton } from '@lyvely/common';
import { IEditModelClient } from '@/common';
import repository from './profile-tags.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/endpoints';

export class ProfileTagsClient
  implements IEditModelClient<UpdateTagModel, TagModel>, IProfileTagsClient
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

export const useProfileTagsClient = useSingleton(() => new ProfileTagsClient());
