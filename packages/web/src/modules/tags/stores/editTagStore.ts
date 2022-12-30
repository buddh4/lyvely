import { defineStore } from 'pinia';
import { TagModel, UpdateTagDto } from '@lyvely/common';
import { computed } from 'vue';
import tagsRepository from '@/modules/tags/repositories/tags.repository';
import { useUpdateModelStore, useArchiveModelStore } from '@/modules/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export const useEditTagStore = defineStore('tagEdit', () => {
  const editState = useUpdateModelStore<UpdateTagDto, TagModel>({
    service: { create: () => <any>null, update: () => <any>null },
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
