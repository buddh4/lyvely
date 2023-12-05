import { getMenuEntries } from '@lyvely/ui';
import { computed } from 'vue';
import { sortBySortOrder } from '@lyvely/interface';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';

export const useProfileMenu = <TContext = any>(menuId: string, context?: TContext) => {
  const allMenuEntries = computed(() => getMenuEntries<TContext>(menuId, context));
  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry) => {
        return (
          (!entry.features?.length || useProfileFeatureStore().isFeaturesEnabled(entry.features)) &&
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
