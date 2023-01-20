import { defineStore } from 'pinia';
import { ContentModel } from '@lyvely/common';
import { computed, ref, watch } from 'vue';
import { getEditContentModalComponent } from '@/modules/content-stream/components/content-stream-entry.registry';

export const useContentEditStore = defineStore('content-edit', () => {
  const editContent = ref<ContentModel>();
  const initOptions = ref<any>();

  const showEditModal = ref(false);

  const resetOnClose = (newVal: boolean) => {
    if (!newVal) reset();
  };

  watch(showEditModal, resetOnClose);

  function reset() {
    showEditModal.value = false;
    editContent.value = undefined;
    initOptions.value = undefined;
  }

  function setEditContent(content?: ContentModel, options?: any) {
    reset();
    if (content) {
      initOptions.value = options;
      editContent.value = content;
      showEditModal.value = true;
    }
  }

  const editModalComponent = computed(() => {
    return editContent.value ? getEditContentModalComponent(editContent.value.type) : undefined;
  });

  return {
    showEditModal,
    editModalComponent,
    reset,
    setEditContent,
    editContent,
    initOptions,
  };
});
