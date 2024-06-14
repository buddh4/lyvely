import { getMenuEntries } from '../registries';
import { computed, unref } from 'vue';
import { sortBySortOrder } from '@/helpers';
import { isNil } from '@lyvely/common';

export const useMenu = <TContext = any>(menuId: string, context?: TContext) => {
  const allMenuEntries = computed(() => getMenuEntries<TContext>(menuId, context));

  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry) => {
        const condition =
          typeof entry.condition === 'function'
            ? entry.condition(context as TContext)
            : entry.condition;
        if (isNil(condition)) return true;
        return unref(condition);
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
