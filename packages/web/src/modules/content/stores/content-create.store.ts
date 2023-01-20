import { defineStore } from 'pinia';
import { ContentModel } from '@lyvely/common';
import { computed, ref, watch } from 'vue';
import {
  getCreateContentModalComponent,
  getEditContentModalComponent,
} from '@/modules/content-stream/components/content-stream-entry.registry';

export const useContentCreateStore = defineStore('content-create', () => {
  const createContentType = ref<string>();
  const initOptions = ref<any>();

  const showCreateModal = ref(false);

  const resetOnClose = (newVal: boolean) => {
    if (!newVal) reset();
  };

  watch(showCreateModal, resetOnClose);

  function reset() {
    showCreateModal.value = false;
    createContentType.value = undefined;
    initOptions.value = undefined;
  }

  function setCreateContent(contentType?: string, options?: any) {
    reset();
    if (contentType) {
      initOptions.value = options;
      createContentType.value = contentType;
      showCreateModal.value = true;
    }
  }

  const createModalComponent = computed(() => {
    return createContentType.value
      ? getCreateContentModalComponent(createContentType.value)
      : undefined;
  });

  return {
    showCreateModal,
    createModalComponent,
    reset,
    setCreateContent,
    createContentType,
    initOptions,
  };
});
