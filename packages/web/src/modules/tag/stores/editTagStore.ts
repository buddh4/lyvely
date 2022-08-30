import { defineStore } from 'pinia';
import { ITag, UpdateTagDto, CreateTagDto } from '@lyvely/common';
import { computed } from 'vue';
import tagsRepository from "@/modules/tag/repositories/tags.repository";
import useEditModelStore from "@/modules/common/stores/editModelStore";
import useArchiveModelStore from "@/modules/common/stores/archiveModelStore";
import { useProfileStore } from "@/modules/profile/stores/profile.store";

export const useEditTagStore = defineStore('tagEdit', () => {

  const editState = useEditModelStore<UpdateTagDto, ITag>({
    repository: tagsRepository,
    onSubmitSuccess: (tag?: ITag) => {
      if(tag) {
        useProfileStore().updateTags([tag]);
      }
    }
  });

  const modalTitle = computed(() => (editState.isCreate.value) ? "tags.create.title" : "tags.edit.title");

  const archiveState = useArchiveModelStore<ITag>({
    repository: tagsRepository,
    onSubmitSuccess: (tag) => {
      useProfileStore().updateTags([tag])
    }
  })


  return {
    modalTitle,
    ...archiveState,
    ...editState
  }
});
