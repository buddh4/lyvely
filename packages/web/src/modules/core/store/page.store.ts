import { defineStore } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useDark, useToggle, useOnline } from '@vueuse/core';
import { ref } from 'vue';
import { isMaxViewSize } from '@/util';

export const usePageStore = defineStore('page', () => {
  const showSidebar = ref(!isMaxViewSize('sm'));
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  const showAppLoader = ref(true);
  const drawerStack = ref<Array<string>>([]);
  const isOnline = useOnline();
  const showMobileFooter = ref(true);

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
    pushDrawer,
    popDrawer,
    toggleSidebar,
    toggleDark,
    setShowAppLoader,
    showAppLoader,
    setTitle,
    isOnline,
    showMobileFooter,
  };
});

export function setPageTitle(title: Array<string> | string) {
  const profile = useProfileStore().profile;

  title = Array.isArray(title) ? title : [title];
  let pageTitle = title.join(' - ');

  if (pageTitle.length && profile) pageTitle += ' - ';

  if (profile) {
    pageTitle += profile.name;
  }

  document.title = pageTitle;
}
