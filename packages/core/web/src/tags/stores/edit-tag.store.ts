import { defineStore } from 'pinia';
import { TagModel, UpdateTagModel, CreateTagModel } from '@lyvely/core-interface';
import { computed } from 'vue';
import tagsRepository from '@/tags/repositories/tags.repository';
import { useUpdateModelStore, useArchiveModelStore } from '@/common';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { useTagsService } from '@/tags/services/tags.service';

export const useEditTagStore = defineStore('tagEdit', () => {
  const editState = useUpdateModelStore<TagModel, CreateTagModel, UpdateTagModel>({
    service: useTagsService(),
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
