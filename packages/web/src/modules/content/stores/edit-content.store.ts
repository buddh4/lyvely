import { defineStore } from 'pinia';
import { ContentModel, CreateContentModel } from '@lyvely/common';
import { useContentService } from '@/modules/content/services/content.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { computed, ref, Component } from 'vue';
import {
  getCreateContentModalComponent,
  getEditContentModalComponent,
} from '@/modules/content-stream/components/content-stream-entry.registry';

export const useEditContentStore = defineStore('edit-content', () => {
  const contentService = useContentService();
  const globalDialog = useGlobalDialogStore();

  const editContent = ref<ContentModel>();
  const createContentType = ref<string>();

  const showEditModal = computed(() => editContent.value);
  const showCreateModal = computed(() => createContentType.value);

  function reset() {
    editContent.value = undefined;
    createContentType.value = undefined;
  }

  function setEditContent(content?: ContentModel) {
    reset();
    if (content) {
      editContent.value = content;
    }
  }

  function setCreateContent(contentType?: string) {
    reset();
    if (contentType) {
      createContentType.value = contentType;
    }
  }

  function getEditModalComponent(): Component | undefined {
    return editContent.value ? getEditContentModalComponent(editContent.value.type) : undefined;
  }

  function getCreateModalComponent(): Component | undefined {
    return createContentType.value
      ? getCreateContentModalComponent(createContentType.value)
      : undefined;
  }

  return {
    showEditModal,
    showCreateModal,
    getEditModalComponent,
    getCreateModalComponent,
    reset,
    setEditContent,
    setCreateContent,
  };
});
