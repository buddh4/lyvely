import { defineStore } from 'pinia';
import { useProfileStore } from "@/modules/user/store/profile.store";

export function setPageTitle(title: Array<string>|string) {
  let profile;
  try {
    profile = useProfileStore().profile;
  } catch (err) {}

  title = Array.isArray(title) ? title : [title];
  let pageTitle = title.join(' - ');

  if(pageTitle.length) pageTitle += ' | ';

  if(profile) {
    pageTitle += profile.name;
  }

  if(pageTitle.length) pageTitle += ' | ';

  pageTitle += window.location.hostname;

  document.title = pageTitle;
}

export const usePageStore = defineStore('page', () => {

  function setTitle(title: Array<string>|string) {
    setPageTitle(title);
  }

  return {
    setTitle
  }
});
