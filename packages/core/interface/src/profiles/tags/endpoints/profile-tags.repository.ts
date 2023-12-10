import { UpdateTagModel, CreateTagModel } from '../models';
import {
  API_PROFILE_TAGS,
  IProfileTagsClient,
  ProfileTagsEndpoints,
} from './profile-tags.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IProfileTagsClient>(API_PROFILE_TAGS);

export default {
  async create(model: CreateTagModel, options?: IProfileApiRequestOptions) {
    return api.post<'create'>(model, {}, options);
  },

  async update(tagId: string, model: UpdateTagModel, options?: IProfileApiRequestOptions) {
    return api.put<'update'>(tagId, model, options);
  },

  async archive(tagId: string, options?: IProfileApiRequestOptions) {
    return api.post<'archive'>(ProfileTagsEndpoints.ARCHIVE(tagId), {}, options);
  },

  async restore(tagId: string, options?: IProfileApiRequestOptions) {
    return api.post<'restore'>(ProfileTagsEndpoints.RESTORE(tagId), {}, options);
  },
};
