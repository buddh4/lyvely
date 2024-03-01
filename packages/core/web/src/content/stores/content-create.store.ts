import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import {
  getContentTypeOptions,
  getCreateContentModalComponent,
  getCreateContentTypes,
} from '../registries';
import { ICreateContentInitOptions } from '../interfaces';
import { useProfileFeatureStore } from '@/profiles';

export const useContentCreateStore = defineStore('content-create', () => {
  const contentType = ref<string>();
  const initOptions = ref<ICreateContentInitOptions>();
  const showContentTypeMenu = ref(false);
  let latestContentType: string | undefined;

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
    if (activeResolve) activeResolve();

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

  function selectContentType(): string {
    const contentType = latestContentType;

    if (checkContentType(contentType)) return contentType;

    for (const contentTypeOptions of getCreateContentTypes()) {
      const type = contentTypeOptions.type;
      if (type !== 'Message' && checkContentType(type)) return type;
    }

    return 'Message';
  }

  function checkContentType(type: string | undefined): type is string {
    if (!type) return false;

    const options = getContentTypeOptions(type);
    if (!options) return false;

    if (options.feature && !useProfileFeatureStore().isFeatureEnabled(options.feature)) {
      return false;
    }

    return true;
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
