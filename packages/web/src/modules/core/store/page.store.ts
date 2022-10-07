import { defineStore } from "pinia";
import { useProfileStore } from "@/modules/profiles/stores/profile.store";
import { useDark, useToggle } from "@vueuse/core";
import { ref } from "vue";

export const usePageStore = defineStore("page", () => {
  const showSidebar = ref(true);
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  const showAppLoader = ref(true);

  function setTitle(title: Array<string> | string) {
    setPageTitle(title);
  }

  function accessibilityFocus(elem: string | HTMLElement) {
    const element: HTMLElement | null =
      elem instanceof HTMLElement ? elem : document.querySelector(elem);

    if (!element) {
      console.warn("Tried to focus non existing element");
    }

    element?.classList.add("focus-hidden");
    element?.focus();
    element?.addEventListener(
      "blur",
      () => {
        element?.classList.remove("focus-hidden");
      },
      { once: true }
    );
  }

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value;
  }

  return {
    isDark,
    showSidebar,
    toggleSidebar,
    toggleDark,
    showAppLoader,
    setTitle,
    accessibilityFocus,
  };
});

export function setPageTitle(title: Array<string> | string) {
  const profile = useProfileStore().profile;

  title = Array.isArray(title) ? title : [title];
  let pageTitle = title.join(" - ");

  if (pageTitle.length) pageTitle += " | ";

  if (profile) {
    pageTitle += profile.name + " | ";
  }

  pageTitle += import.meta.env.VITE_APP_BASEURL || window.location.hostname;

  document.title = pageTitle;
}
