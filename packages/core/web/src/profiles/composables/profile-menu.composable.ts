import { getMenuEntries } from '@/ui';
import { computed } from 'vue';
import { isFeatureEnabledOnProfile } from '../helpers';
import { sortBySortOrder } from '@lyvely/common';

export const useProfileMenu = (menuId: string) => {
  const allMenuEntries = getMenuEntries(menuId);
  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry) => {
        return (
          (!entry.feature || isFeatureEnabledOnProfile(entry.feature).value) &&
          (typeof entry.condition === 'undefined' || entry.condition)
        );
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
