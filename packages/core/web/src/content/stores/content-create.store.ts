import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { getCreateContentModalComponent } from '../services';
import { ICreateContentInitOptions } from '../interfaces';

export const useContentCreateStore = defineStore('content-create', () => {
  const contentType = ref<string>();
  const initOptions = ref<ICreateContentInitOptions>();
  const showContentTypeMenu = ref(false);
  let latestContentType: string;

  const showCreateModal = ref(false);

  let activeResolve: ((res?: any) => void) | undefined;

  const resetOnClose = (newVal: boolean) => {
    if (!newVal) reset();
  };

  watch(showCreateModal, resetOnClose);

  function reset() {
    showCreateModal.value = false;
    contentType.value = undefined;
    initOptions.value = undefined;
    showContentTypeMenu.value = false;

    // The resolve handler was not called
    if (activeResolve) {
      activeResolve();
    }

    activeResolve = undefined;
  }

  function createContentType(
    type?: string,
    options?: ICreateContentInitOptions,
    withContentTypeMenu = false,
  ): Promise<any> {
    reset();

    if (!type) return Promise.resolve();

    initOptions.value = options;
    contentType.value = type;
    latestContentType = type;
    showContentTypeMenu.value = withContentTypeMenu;
    showCreateModal.value = true;

    return new Promise((resolve) => {
      activeResolve = resolve;
    });
  }

  function onCreated(resp: any) {
    if (activeResolve) activeResolve(resp);
    activeResolve = undefined;
  }

  function onCanceled() {
    if (activeResolve) activeResolve();
    activeResolve = undefined;
  }

  function createAnyContent(options?: ICreateContentInitOptions) {
    const contentType = selectContentType();
    createContentType(contentType, options, true);
  }

  function selectContentType() {
    // content type filter active?
    // latest type selected
    // default selected
    return latestContentType || 'Task';
  }

  const createModalComponent = computed(() => {
    return contentType.value ? getCreateContentModalComponent(contentType.value) : undefined;
  });

  return {
    showCreateModal,
    createModalComponent,
    showContentTypeMenu,
    reset,
    contentType,
    createAnyContent,
    createContentType,
    initOptions,
    onCreated,
    onCanceled,
  };
});
