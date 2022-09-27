import { defineStore } from 'pinia';
import { TagModel, UpdateTagDto } from '@lyvely/common';
import { computed } from 'vue';
import tagsRepository from "@server/modules/tag/repositories/tags.repository";
import useEditModelStore from "@server/modules/common/stores/editModelStore";
import useArchiveModelStore from "@server/modules/common/stores/archiveModelStore";
import { useProfileStore } from "@server/modules/profile/stores/profile.store";

export const useEditTagStore = defineStore('tagEdit', () => {

  const editState = useEditModelStore<UpdateTagDto, TagModel>({
    repository: tagsRepository,
    onSubmitSuccess: (tag?: TagModel) => {
      if(tag) {
        useProfileStore().updateTags([tag]);
      }
    }
  });

  const modalTitle = computed(() => (editState.isCreate.value) ? "tags.create.title" : "tags.edit.title");

  const archiveState = useArchiveModelStore<TagModel>({
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
