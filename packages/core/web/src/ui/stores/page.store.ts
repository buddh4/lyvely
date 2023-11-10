import { defineStore } from 'pinia';
import { useDark, useToggle, useOnline } from '@vueuse/core';
import { ref } from 'vue';
import { isMaxViewSize, Icons } from '@lyvely/ui';
import { repository, useGlobalDialogStore } from '@/core';
import { usePingService } from '@/ping';
import { useFlashStore } from './flash.store';

export const usePageStore = defineStore('ui-page', () => {
  const showSidebar = ref(!isMaxViewSize('sm'));
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  const showAppLoader = ref(true);
  const isOnline = useOnline();
  const showMobileFooter = ref(true);
  const noSwipe = ref(false);
  const hasHistory = false;
  const loaded = ref(false);

  function setTitle(title: Array<string> | string) {
    setPageTitle(title);
  }

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value;
  }

  let loaderContexts = new Set<string>();

  function setShowAppLoader(contextOrShow: string | boolean, show?: boolean) {
    if (typeof contextOrShow === 'boolean') {
      show = contextOrShow;
      if (!contextOrShow) loaderContexts = new Set<string>();
    }

    if (typeof contextOrShow === 'string') {
      if (show) loaderContexts.add(contextOrShow);
      else loaderContexts.delete(contextOrShow);
    }

    if (show === showAppLoader.value) return;
    if (!show && loaderContexts.size) return;

    showAppLoader.value = !!show;
  }

  return {
    isDark,
    showSidebar,
    noSwipe,
    toggleSidebar,
    toggleDark,
    setShowAppLoader,
    showAppLoader,
    setTitle,
    isOnline,
    showMobileFooter,
    hasHistory,
    loaded,
  };
});

export function setPageTitle(title: Array<string> | string) {
  title = Array.isArray(title) ? title : [title];
  const pageTitle = title.join(' - ');
  document.title = pageTitle;
}

let pingInterval: number | undefined = undefined;

repository.interceptors.response.use(undefined, (error) => {
  return new Promise((resolve, reject) => {
    if (!error.response) {
      if (usePageStore().loaded) {
        useFlashStore().addErrorFlash('error.network.message');
      } else {
        useGlobalDialogStore().showError({
          icon: Icons.error_network.name,
          title: 'error.network.title',
          message: 'error.network.message',
          buttonType: 'reload',
        });

        if (!pingInterval) {
          pingInterval = setInterval(() => {
            usePingService()
              .ping()
              .then((result) => {
                if (result) {
                  clearInterval(pingInterval);
                  document.location.reload();
                }
              });
          }, 2000) as any;
        }
      }
    } else if (
      error.response.status === 403 &&
      error.response.data.message === 'invalid csrf token'
    ) {
      useGlobalDialogStore().showError({
        icon: Icons.error_network.name,
        title: 'error.csrf.title',
        message: 'error.csrf.message',
        buttonType: 'reload',
      });
    }

    reject(error);
  });
});
