import { defineStore } from 'pinia';
import { TagModel, UpdateTagDto } from '@lyvely/common';
import { computed } from 'vue';
import tagsRepository from '@/modules/tags/repositories/tags.repository';
import { useEditModelStore, useArchiveModelStore } from '@/modules/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export const useEditTagStore = defineStore('tagEdit', () => {
  const editState = useEditModelStore<UpdateTagDto, TagModel>({
    repository: tagsRepository,
    onSubmitSuccess: (tag?: TagModel) => {
      if (tag) {
        useProfileStore().updateTags([tag]);
      }
    },
  });

  const modalTitle = computed(() => (editState.isCreate.value ? 'tags.create.title' : 'tags.edit.title'));

  const archiveState = useArchiveModelStore<TagModel>({
    repository: tagsRepository,
    onSubmitSuccess: (tag) => {
      useProfileStore().updateTags([tag]);
    },
  });

  return {
    modalTitle,
    ...archiveState,
    ...editState,
  };
});
