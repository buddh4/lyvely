import repository from "@/repository";
import { UpdateTagDto, CreateTagDto, ITag } from "@lyvely/common";

const resource = "tags";

export default {
  async create(model: CreateTagDto) {
    return repository.post<ITag>(`${resource}`, model);
  },

  async update(tagId: string, model: Partial<UpdateTagDto>) {
    return repository.put<ITag>(`${resource}/${tagId}`, model);
  },

  async archive(tagId: string) {
    return repository.post<boolean>(`${resource}/${tagId}/archive`);
  },

  async unArchive(tagId: string) {
    return repository.post<boolean>(`${resource}/${tagId}/unarchive`);
  }
};
