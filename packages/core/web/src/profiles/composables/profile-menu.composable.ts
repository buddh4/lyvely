import { getMenuEntries, type IMenuEntry } from '@lyvely/ui';
import { computed } from 'vue';
import { sortBySortOrder } from '@lyvely/interface';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';
import { isNil } from '@lyvely/common';

export const useProfileMenu = <TContext = any>(menuId: string, context?: TContext) => {
  const allMenuEntries = computed(() => getMenuEntries<TContext>(menuId, context));
  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry: IMenuEntry) => {
        return (
          (isNil(entry.feature) || useProfileFeatureStore().isFeaturesEnabled(entry.feature)) &&
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
