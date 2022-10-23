import repository from '@/repository';
import { UpdateTagDto, CreateTagDto, TagModel } from '@lyvely/common';

const resource = 'tags';

export default {
  async create(model: CreateTagDto) {
    return repository.post<TagModel>(`${resource}`, model);
  },

  async update(tagId: string, model: Partial<UpdateTagDto>) {
    return repository.put<TagModel>(`${resource}/${tagId}`, model);
  },

  async archive(tagId: string) {
    return repository.post<boolean>(`${resource}/${tagId}/archive`);
  },

  async unArchive(tagId: string) {
    return repository.post<boolean>(`${resource}/${tagId}/unarchive`);
  },
};
