import { getMenuEntries } from '../registries';
import { computed } from 'vue';
import { sortBySortOrder } from '@/helpers';

export const useMenu = <TContext = any> (menuId: string, context?: TContext) => {
  const allMenuEntries = computed(() => getMenuEntries(menuId, context));

  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
        .filter((entry) => {
          return typeof entry.condition === 'undefined' || entry.condition;
        })
        .sort(sortBySortOrder);
  });

  const hasEnabledEntries = computed(() => !!enabledMenuEntries.value.length);

  return {
    allMenuEntries,
    enabledMenuEntries,
    hasEnabledEntries,
  };
};

