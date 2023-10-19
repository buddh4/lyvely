import { getMenuEntries } from '@/ui';
import { computed } from 'vue';
import { sortBySortOrder } from '@lyvely/common';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';

export const useProfileMenu = (menuId: string) => {
  const allMenuEntries = getMenuEntries(menuId);
  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry) => {
        return (
          (!entry.feature || useProfileFeatureStore().isFeatureEnabled(entry.feature).value) &&
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
