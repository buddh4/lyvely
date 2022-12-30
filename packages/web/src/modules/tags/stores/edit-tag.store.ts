import { defineStore } from 'pinia';
import { TagModel, UpdateTagDto } from '@lyvely/common';
import { computed } from 'vue';
import tagsRepository from '@/modules/tags/repositories/tags.repository';
import { useUpdateModelStore, useArchiveModelStore } from '@/modules/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useTagsService } from '@/modules/tags/services/tags.service';

export const useEditTagStore = defineStore('tagEdit', () => {
  const editState = useUpdateModelStore<TagModel, UpdateTagDto>({
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
