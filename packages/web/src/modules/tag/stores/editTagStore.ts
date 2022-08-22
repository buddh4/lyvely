import { defineStore } from 'pinia';
import { ITag, EditTagDto } from '@lyvely/common';
import { computed } from 'vue';
import tagsRepository from "@/modules/tag/repositories/tags.repository";
import useEditModelStore from "@/modules/common/stores/editModelStore";
import { useProfileStore } from "@/modules/user/store/profile.store";

export const useEditTagStore = defineStore('activityEdit', () => {

  const state = useEditModelStore<EditTagDto, ITag>({
    repository: tagsRepository,
    onSubmitSuccess: (tag?: ITag) => {
      if(tag) {
        useProfileStore().updateTags([tag]);
      }
    }
  });

  const modalTitle = computed(() => (state.isCreate.value) ? "tags.create.title" : "tags.edit.title");

  return {
    modalTitle,
    ...state
  }
});
