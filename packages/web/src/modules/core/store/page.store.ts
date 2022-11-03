import { defineStore } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useDark, useToggle } from '@vueuse/core';
import { ref } from 'vue';

export const usePageStore = defineStore('page', () => {
  const showSidebar = ref(true);
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  const showAppLoader = ref(true);
  const modalStack = ref<Array<string>>([]);
  const drawerStack = ref<Array<string>>([]);

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

  function pushModal(id: string) {
    return modalStack.value.push(id);
  }

  function popModal(id: string) {
    modalStack.value = modalStack.value.filter((mId) => mId !== id);
    return modalStack.value.length;
  }

  function pushDrawer(id: string) {
    return drawerStack.value.push(id);
  }

  function popDrawer(id: string) {
    drawerStack.value = drawerStack.value.filter((mId) => mId !== id);
    return drawerStack.value.length;
  }

  return {
    isDark,
    showSidebar,
    pushModal,
    popModal,
    pushDrawer,
    popDrawer,
    toggleSidebar,
    toggleDark,
    setShowAppLoader,
    showAppLoader,
    setTitle,
  };
});

export function setPageTitle(title: Array<string> | string) {
  const profile = useProfileStore().profile;

  title = Array.isArray(title) ? title : [title];
  let pageTitle = title.join(' - ');

  if (pageTitle.length) pageTitle += ' | ';

  if (profile) {
    pageTitle += profile.name + ' | ';
  }

  pageTitle += import.meta.env.VITE_APP_BASEURL || window.location.hostname;

  document.title = pageTitle;
}
