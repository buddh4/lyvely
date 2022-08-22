import repository from "@/repository";
import { EditTagDto , ITag } from "@lyvely/common";

const resource = "tags";

export default {
  async create(activitiy: EditTagDto) {
    return repository.post<ITag>(`${resource}`, activitiy);
  },

  async update(tagId: string, model: EditTagDto) {
    return repository.post<ITag>(`${resource}/${tagId}`, model);
  }
};
