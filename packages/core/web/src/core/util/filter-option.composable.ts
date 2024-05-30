import { Filter } from '@lyvely/common';
import { computed } from 'vue';

export const useFilterOption = <TOptions = any>(
  filter: Pick<Filter<any, TOptions>, 'option' | 'setOption'>,
  key: keyof TOptions
) => {
  return computed({
    get: () => filter.option(key),
    set: (value) => filter.setOption(key, value),
  });
};
