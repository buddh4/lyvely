import repository from '@/repository';
import {
  UpdateTag,
  CreateTagModel,
  ENDPOINT_PROFILE_TAGS,
  EndpointResult,
  IProfileTagsService,
} from '@lyvely/common';

export default {
  async create(model: CreateTagModel) {
    return repository.post<EndpointResult<IProfileTagsService['create']>>(
      ENDPOINT_PROFILE_TAGS,
      model,
    );
  },

  async update(tagId: string, model: UpdateTag) {
    return repository.put<EndpointResult<IProfileTagsService['update']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}`,
      model,
    );
  },

  async archive(tagId: string) {
    return repository.post<EndpointResult<IProfileTagsService['archive']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}/archive`,
    );
  },

  async unarchive(tagId: string) {
    return repository.post<EndpointResult<IProfileTagsService['unarchive']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}/unarchive`,
    );
  },
};
