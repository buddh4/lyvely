import { getMenuEntries } from './menus.registry';
import { computed } from 'vue';
import { sortBySortOrder } from '@lyvely/common';

export const useMenu = (menuId: string) => {
  const allMenuEntries = getMenuEntries(menuId);
  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry) => {
        return typeof entry.condition === 'undefined' || entry.condition;
      })
      .sort(sortBySortOrder);
  });

  const hasEnabledEntries = computed(() => !!enabledMenuEntries.value.length);

  return {
    enabledMenuEntries,
    allMenuEntries,
    hasEnabledEntries,
  };
};
