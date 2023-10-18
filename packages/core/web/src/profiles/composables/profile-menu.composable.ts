import { getMenuEntries } from '@/ui';
import { computed } from 'vue';
import { sortBySortOrder } from '@lyvely/common';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/profiles';

export const useProfileMenu = (menuId: string) => {
  const allMenuEntries = getMenuEntries(menuId);
  const enabledMenuEntries = computed(() => {
    const { profile } = storeToRefs(useProfileStore());
    console.log('asdf', profile.value?.disabledFeatures);
    const test = allMenuEntries.value
      .filter((entry) => {
        return (
          (!entry.feature || useProfileFeatureStore().isFeatureEnabled(entry.feature).value) &&
          (typeof entry.condition === 'undefined' || entry.condition)
        );
      })
      .sort(sortBySortOrder);
    debugger;
    return test;
  });

  const hasEnabledEntries = computed(() => !!enabledMenuEntries.value.length);

  return {
    enabledMenuEntries,
    allMenuEntries,
    hasEnabledEntries,
  };
};
