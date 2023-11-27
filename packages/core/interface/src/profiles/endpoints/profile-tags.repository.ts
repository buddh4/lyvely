import { UpdateTagModel, CreateTagModel } from '../models';
import {
  ENDPOINT_PROFILE_TAGS,
  IProfileTagsClient,
  ProfileTagsEndpointPaths,
} from './profile-tags.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IProfileTagsClient>(ENDPOINT_PROFILE_TAGS);

export default {
  async create(model: CreateTagModel, options?: IProfileApiRequestOptions) {
    return api.post<'create'>(model, {}, options);
  },

  async update(tagId: string, model: UpdateTagModel, options?: IProfileApiRequestOptions) {
    return api.put<'update'>(tagId, model, options);
  },

  async archive(tagId: string, options?: IProfileApiRequestOptions) {
    return api.post<'archive'>(ProfileTagsEndpointPaths.ARCHIVE(tagId), {}, options);
  },

  async restore(tagId: string, options?: IProfileApiRequestOptions) {
    return api.post<'restore'>(ProfileTagsEndpointPaths.RESTORE(tagId), {}, options);
  },
};
