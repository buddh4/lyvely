import { defineStore } from 'pinia';
import { TagModel, UpdateTagModel, CreateTagModel, useProfileTagsClient } from '@lyvely/interface';
import { computed } from 'vue';
import { useUpdateModelStore, useArchiveModelStore } from '@/common';
import { useProfileStore } from '@/profiles/stores/profile.store';

export const useEditTagStore = defineStore('tagEdit', () => {
  const editState = useUpdateModelStore<TagModel, CreateTagModel, UpdateTagModel>({
    client: useProfileTagsClient(),
    onSubmitSuccess: (tag?: TagModel) => {
      if (tag) {
        useProfileStore().updateTags([tag]);
      }
    },
  });

  const modalTitle = computed(() =>
    editState.isCreate.value ? 'tags.create.title' : 'tags.edit.title',
  );

  const archiveState = useArchiveModelStore<TagModel>({
    client: useProfileTagsClient(),
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
