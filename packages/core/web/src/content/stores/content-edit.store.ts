import { defineStore } from 'pinia';
import { ContentModel } from '@lyvely/interface';
import { computed, ref, watch } from 'vue';
import { getEditContentModalComponent } from '../registries';

export const useContentEditStore = defineStore('content-edit', () => {
  const editModel = ref<ContentModel>();
  const initOptions = ref<any>();

  const showEditModal = ref(false);

  let activeResolve: ((res?: any) => void) | undefined;

  const resetOnClose = (newVal: boolean) => {
    if (!newVal) reset();
  };

  watch(showEditModal, resetOnClose);

  function reset() {
    showEditModal.value = false;
    editModel.value = undefined;
    initOptions.value = undefined;

    // The resolve handler was not called
    if (activeResolve) activeResolve();
    activeResolve = undefined;
  }

  function editContent(content?: ContentModel, options?: any) {
    reset();

    if (!content) return Promise.resolve();

    initOptions.value = options;
    editModel.value = content;
    showEditModal.value = true;

    return new Promise((resolve) => {
      activeResolve = resolve;
    });
  }

  function onUpdated(resp: any) {
    if (activeResolve) activeResolve(resp);
    activeResolve = undefined;
  }

  function onCanceled() {
    if (activeResolve) activeResolve();
    activeResolve = undefined;
  }

  const editModalComponent = computed(() => {
    return editModel.value ? getEditContentModalComponent(editModel.value.type) : undefined;
  });

  return {
    showEditModal,
    editModalComponent,
    reset,
    editContent,
    editModel,
    initOptions,
    onUpdated,
    onCanceled,
  };
});
