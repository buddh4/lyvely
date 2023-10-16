import { getMenuEntries } from '@/menus/menus.registry';
import { computed } from 'vue';
import { isFeatureEnabledOnProfile } from '@/features';
import { sortBySortOrder } from '@lyvely/common';

export const useMenu = (menuId: string) => {
  const allMenuEntries = getMenuEntries(menuId);
  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry) => {
        const test = entry.condition;

        const result =
          (!entry.feature || isFeatureEnabledOnProfile(entry.feature).value) &&
          (typeof entry.condition === 'undefined' || entry.condition);
        debugger;
        return result;
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
